import { Subject } from 'rxjs';
import {
  RecipeStatus, RecipeCommand,
  RecipeContext as RecipeContextModel
} from 'models';
import { Repository } from 'lib/repository';
import { Scheduler } from 'lib/scheduler';
import { RecipeEvent, RecipeEventType } from './recipe-event';
import { RecipeState } from './recipe-machine';
import { RecipeInstance } from './recipe-instance';

export class RecipeContext extends RecipeContextModel {

  public recipeInstance: RecipeInstance
  private _eventSubject: Subject<RecipeEvent>
  private _recipeState: RecipeState

  constructor(
    public repository: Repository,
    public scheduler: Scheduler,
    environment?: string
  ) {
    super();

    this.environment = environment;
    this.status = RecipeStatus.NO_RECIPE;
  }

  command(recipeCommand: RecipeCommand, recipeId?: string) {
    switch (recipeCommand) {

      case RecipeCommand.START:
        this._recipeState.startRecipe(recipeId);
        break;

      case RecipeCommand.PAUSE:
        this._recipeState.pauseRecipe();
        break;

      case RecipeCommand.RESUME:
        this._recipeState.resumeRecipe();
        break;

      case RecipeCommand.STOP:
        this._recipeState.stopRecipe();
        break;

      case RecipeCommand.EJECT:
        this._recipeState.ejectRecipe();
        break;
    }
  }

  async loadRecipeInstance(recipeId: string = this.recipeId) {
    if (!recipeId) return;

    const recipe = await this.repository.getRecipe(recipeId);

    if (!recipe)
      throw new Error(`Recipe '${recipeId}' not found`);

    this.recipeId = recipe.id;
    this.recipeInstance = new RecipeInstance(recipe);
  }

  publishEvent(eventType: RecipeEventType, variableValues?: Map<string, number>) {
    if (!this._eventSubject || eventType === undefined) return;
    const recipeEvent = new RecipeEvent(this, eventType, variableValues);
    this._eventSubject.next(recipeEvent);
  }

  serializeForBroadcast(): RecipeContextModel {
    return { ...this.serialize(), progress: this.progress };
  }

  deserialize(source: RecipeContextModel): RecipeContext {
    return Object.assign(this, source);
  }

  reset() {
    this.environment = this.environment;
    delete this.instanceId;
    delete this.recipeId;
    this.status = RecipeStatus.NO_RECIPE;
    delete this.error;
    delete this.startedAt;
    delete this.resumedAt;
    delete this.pausedAt;
    delete this.stoppedAt;
    delete this.finishedAt;
    delete this.errorAt;
    delete this.progress;
  }

  set eventSubject(eventSubject: Subject<RecipeEvent>) {
    this._eventSubject = eventSubject;
  }

  set recipeState(recipeState: RecipeState) {
    this._recipeState = recipeState;
    this._recipeState.handle(this);
  }
}
