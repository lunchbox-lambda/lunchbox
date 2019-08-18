import logger from 'lib/logger';
import { TYPES, inject, injectable } from 'lib/inversify';
import { Subject } from 'rxjs';
import { RecipeCommand } from 'models';
import { Scheduler } from 'lib/scheduler';
import { Repository } from 'lib/repository';
import { Broadcaster } from 'lib/broadcaster';
import { RecipeMachine } from '../recipe-machine';
import { RecipeContext } from '../recipe-context';
import { RecipeManager } from 'kernel/recipe-manager';
import { RecipeEvent, RecipeEventType } from '../recipe-event';

const log = logger('kernel:recipe-manager');

@injectable()
export class DefaultRecipeManager implements RecipeManager {
  @inject(TYPES.Scheduler) private scheduler: Scheduler
  @inject(TYPES.Repository) private repository: Repository
  @inject(TYPES.Broadcaster) private broadcaster: Broadcaster

  private eventSubject = new Subject<RecipeEvent>()
  public recipeEvents = this.eventSubject.asObservable()
  private contexts: Map<string, RecipeContext> = new Map()

  public async init() {
    log(`init`);

    await this.loadRecipeContexts();
    await this.subscribeRecipeEvents();
    await this.startRecipes();
  }

  private async loadRecipeContexts() {
    const environments = await this.repository.getEnvironments();
    for (let environment of environments) {
      let context = await this.repository.getRecipeContext(environment);

      if (!context) {
        context = await this.repository.upsertRecipeContext(
          new RecipeContext(
            this.repository, this.scheduler, environment
          ).serialize()
        );
      }

      const recipeContext = new RecipeContext(
        this.repository, this.scheduler
      ).deserialize(context);

      recipeContext.eventSubject = this.eventSubject;
      this.contexts.set(environment, recipeContext);
    }
  }

  private async startRecipes() {
    const recipeMachine = new RecipeMachine();
    const contexts = [...this.recipeContexts.values()];
    for (let context of contexts) {
      await recipeMachine.start(context);
    }
  }

  private async subscribeRecipeEvents() {
    this.recipeEvents.subscribe(event => {
      const { context } = event;
      const { environment, recipeInstance, error } = context;
      const name = recipeInstance ? recipeInstance.name : null;

      this.broadcaster.broadcast('recipe-context', context.serializeForBroadcast());

      switch (event.eventType) {
        case RecipeEventType.NO_RECIPE_LOADED:
          log(`no recipe loaded in the "${environment}" environment`);
          break;

        case RecipeEventType.RECIPE_STARTED:
          log(`recipe "${name}" [▶️] started in the "${environment}" environment`);
          break;

        case RecipeEventType.RECIPE_RESUMED:
          log(`recipe "${name}" [▶️] resumed in the "${environment}" environment`);
          break;

        case RecipeEventType.RECIPE_RUNNING:
          log(`recipe "${name}" [🌀] running in the "${environment}" environment`);
          break;

        case RecipeEventType.RECIPE_PAUSED:
          log(`recipe "${name}" [⏸️] paused in the "${environment}" environment`);
          break;

        case RecipeEventType.RECIPE_STOPPED:
          log(`recipe "${name}" [⏹️] stopped in the "${environment}" environment`);
          break;

        case RecipeEventType.RECIPE_FINISHED:
          log(`recipe "${name}" [✔️] finished in the "${environment}" environment`);
          break;

        case RecipeEventType.RECIPE_EJECTED:
          log(`recipe "${name}" [⏏️] ejected in the "${environment}" environment`);
          break;

        case RecipeEventType.ERROR_OCCURED:
          log(`error occured with recipe "${name}" in the "${environment}" environment - ${error}`, 'error');
          break;
      }
    });
  }

  public command(environment: string, command: RecipeCommand, recipeId?: string) {
    const recipeContext = this.contexts.get(environment);
    recipeContext.command(command, recipeId);
  }

  public get recipeContexts(): Map<string, RecipeContext> {
    return this.contexts;
  }
}
