import * as uuid from 'uuid';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { RecipeStatus } from 'models';
import { RecipeEventType } from './recipe-event';
import { RecipeContext } from './recipe-context';
import { synthesizeVariable } from 'lib/tools';

export class RecipeMachine {

  public async start(context: RecipeContext) {
    let state: RecipeState;

    switch (context.status) {

      case RecipeStatus.NO_RECIPE:
        state = new NoRecipeState();
        break;

      case RecipeStatus.STARTED:
      case RecipeStatus.RESUMED:
      case RecipeStatus.RUNNING:
        state = new RecipeRunningState();
        break;

      case RecipeStatus.PAUSED:
        state = new RecipePausedState();
        break;

      case RecipeStatus.STOPPED:
        state = new RecipeStoppedState();
        break;

      case RecipeStatus.FINISHED:
        state = new RecipeFinishedState();
        break;

      case RecipeStatus.ERROR:
        state = new RecipeErrorState(context.error);
        break;
    }

    try {
      await context.loadRecipeInstance();
    } catch (error) {
      state = new RecipeErrorState(error.message);
    }

    context.recipeState = state;
  }

}

export abstract class RecipeState {

  private isLocked: boolean = false
  protected context: RecipeContext
  protected async onStateEnter(): Promise<void | RecipeState> { }

  public async handle(context: RecipeContext) {
    if (this.isLocked) return;

    this.isLocked = true;
    this.context = context;

    const recipeEvent = Reflect.getMetadata('RecipeEvent', this.constructor);
    const recipeStatus = Reflect.getMetadata('RecipeStatus', this.constructor);

    // Don't re-execute the state when RecipeMachine starts
    const shouldExecuteState =
      this.context.status !== recipeStatus ||
      this.context.status === RecipeStatus.RUNNING;

    this.context.status = recipeStatus;
    const nextState = shouldExecuteState && await this.onStateEnter();
    await this.saveRecipeState();
    this.context.publishEvent(recipeEvent);

    this.isLocked = false;

    if (nextState)
      this.context.recipeState = nextState;
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public startRecipe(recipeId?: string) { this.rejectState(); }
  public pauseRecipe() { this.rejectState(); }
  public resumeRecipe() { this.rejectState(); }
  public stopRecipe() { this.rejectState(); }
  public ejectRecipe() { this.rejectState(); }

  private rejectState() {
    throw new Error('Invalid command');
  }

  protected async saveRecipeState() {
    this.context.repository.upsertRecipeContext(this.context.serialize());
  }
}

@RecipeStateStatus(RecipeStatus.NO_RECIPE, RecipeEventType.NO_RECIPE_LOADED)
class NoRecipeState extends RecipeState {

  protected async onStateEnter() {
    this.context.reset();
  }

  public startRecipe(recipeId: string) {
    this.context.recipeState = new RecipeStartedState(recipeId);
  }
}

@RecipeStateStatus(RecipeStatus.STARTED, RecipeEventType.RECIPE_STARTED)
class RecipeStartedState extends RecipeState {

  public constructor(private recipeId: string) {
    super();
  }

  protected async onStateEnter() {
    await this.context.loadRecipeInstance(this.recipeId);
    this.context.recipeId = this.recipeId;
    this.context.instanceId = uuid.v4();
    this.context.startedAt = new Date();
    return new RecipeRunningState();
  }
}

@RecipeStateStatus(RecipeStatus.RESUMED, RecipeEventType.RECIPE_RESUMED)
class RecipeResumedState extends RecipeState {

  protected async onStateEnter() {
    this.context.resumedAt = new Date();
    return new RecipeRunningState();
  }
}

@RecipeStateStatus(RecipeStatus.RUNNING, RecipeEventType.RECIPE_RUNNING)
class RecipeRunningState extends RecipeState {

  private subscription: Subscription
  private offsetIndex: number

  protected async onStateEnter() {

    this.subscription = this.context.scheduler.interval(() => {
      this.advanceRecipePosition();
    }, 1000);

    this.offsetIndex = -1;
  }

  public pauseRecipe() {
    this.context.recipeState = new RecipePausedState();
  }

  public stopRecipe() {
    this.context.recipeState = new RecipeStoppedState();
  }

  private advanceRecipePosition() {
    const { environment, recipeInstance } = this.context;

    // Clear the timer if the status changed
    if (this.context.status != RecipeStatus.RUNNING) {
      this.subscription.unsubscribe();
      return;
    }

    const { duration } = recipeInstance;
    const currentPosition = this.resolveRecipePosition();

    // Update the progress indicator
    this.updateProgress(duration, currentPosition);

    // Check if the recipe finished
    if (currentPosition >= duration) {
      this.context.recipeState = new RecipeFinishedState();
      return;
    }

    // Check if the recipe advanced to the next offset in the time series
    const offsetIndex = this.resolveOffsetIndex(currentPosition);

    if (this.offsetIndex !== offsetIndex) {
      this.offsetIndex = offsetIndex;

      const offset = recipeInstance.offsets[offsetIndex];
      const recipePoint = recipeInstance.timeSeries.get(offset);
      const variableValues = recipePoint.variableValues;

      this.context.publishEvent(
        RecipeEventType.OFFSET_CHANGED,
        new Map(Array.from(variableValues, ([key, value]) => {
          const variable = synthesizeVariable(environment, key);
          return [variable, value] as [string, number];
        }))
      );
    }
  }

  private resolveRecipePosition() {
    const { startedAt } = this.context;
    const started = moment(startedAt);
    return moment().diff(started, 'seconds');
  }

  private resolveOffsetIndex(currentPosition: number): number {
    const { offsets } = this.context.recipeInstance;

    if (this.offsetIndex === -1) {
      let index = offsets.length;
      while (index--) {
        if (offsets[index] <= currentPosition)
          break;
      }
      return index;
    } else {
      const nextOffsetIndex = this.offsetIndex + 1;
      const nextOffset = offsets[nextOffsetIndex];
      return nextOffset <= currentPosition ? nextOffsetIndex : this.offsetIndex;
    }
  }

  private updateProgress(duration, currentPosition) {
    const position = Math.min(duration, currentPosition);
    this.context.progress = position / duration;
  }
}

@RecipeStateStatus(RecipeStatus.PAUSED, RecipeEventType.RECIPE_PAUSED)
class RecipePausedState extends RecipeState {

  protected async onStateEnter() {
    this.context.pausedAt = new Date();
  }

  public stopRecipe() {
    this.context.recipeState = new RecipeStoppedState();
  }

  public resumeRecipe() {
    this.context.recipeState = new RecipeResumedState();
  }
}

@RecipeStateStatus(RecipeStatus.STOPPED, RecipeEventType.RECIPE_STOPPED)
class RecipeStoppedState extends RecipeState {

  protected async onStateEnter() {
    this.context.stoppedAt = new Date();
  }

  public startRecipe(recipeId: string) {
    this.context.recipeState = new RecipeStartedState(recipeId);
  }

  public ejectRecipe() {
    this.context.recipeState = new NoRecipeState();
    this.context.publishEvent(RecipeEventType.RECIPE_EJECTED);
  }
}

@RecipeStateStatus(RecipeStatus.FINISHED, RecipeEventType.RECIPE_FINISHED)
class RecipeFinishedState extends RecipeState {

  protected async onStateEnter() {
    this.context.finishedAt = new Date();
  }

  public startRecipe(recipeId: string) {
    this.context.recipeState = new RecipeStartedState(recipeId);
  }

  public ejectRecipe() {
    this.context.recipeState = new NoRecipeState();
    this.context.publishEvent(RecipeEventType.RECIPE_EJECTED);
  }
}

@RecipeStateStatus(RecipeStatus.ERROR, RecipeEventType.ERROR_OCCURED)
class RecipeErrorState extends RecipeState {

  public constructor(private error: string) {
    super();
  }

  protected async onStateEnter() {
    this.context.error = this.error;
    this.context.errorAt = new Date();
  }

  public startRecipe(recipeId: string) {
    this.context.recipeState = new RecipeStartedState(recipeId);
  }

  public ejectRecipe() {
    this.context.recipeState = new NoRecipeState();
    this.context.publishEvent(RecipeEventType.RECIPE_EJECTED);
  }
}

function RecipeStateStatus(recipeStatus: RecipeStatus, recipeEvent: RecipeEventType) {
  return function (target: Function) {
    Reflect.defineMetadata('RecipeStatus', recipeStatus, target);
    Reflect.defineMetadata('RecipeEvent', recipeEvent, target);
  };
}
