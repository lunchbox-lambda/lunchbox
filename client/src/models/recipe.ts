import { Entity, EntityOption } from './entity';

export class Recipe extends Entity {
  public name: string
  public description?: string
  public phases: {
    name: string;
    cycles: number;
    dayparts: {
      [K in 'dawn' | 'day' | 'dusk' | 'night']: {
        duration: string;
        variables: {
          [variable: string]: number;
        };
      }
    };
  }[]
}

export class RecipeOption extends EntityOption {

}

export class RecipeContext {
  public environment: string
  public instanceId: string
  public recipeId: string
  public status: RecipeStatus
  public startedAt: Date
  public resumedAt: Date
  public pausedAt: Date
  public stoppedAt: Date
  public finishedAt: Date
  public errorAt: Date
  public progress?: number
}

export enum RecipeCommand {
  START,
  PAUSE,
  RESUME,
  STOP,
  EJECT
}

export enum RecipeStatus {
  NO_RECIPE,
  STARTED,
  RESUMED,
  RUNNING,
  PAUSED,
  STOPPED,
  FINISHED,
  ERROR
}
