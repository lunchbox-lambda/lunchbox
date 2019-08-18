import { Entity, EntityOption } from './entity';
import { ISerializable } from './serializable';

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

export class RecipeContext implements ISerializable {
  public environment: string
  public instanceId: string
  public recipeId: string
  public status: RecipeStatus
  public error: string
  public startedAt: Date
  public resumedAt: Date
  public pausedAt: Date
  public stoppedAt: Date
  public finishedAt: Date
  public errorAt: Date

  public progress?: number

  public serialize?= () => ({
    environment: this.environment,
    instanceId: this.instanceId,
    recipeId: this.recipeId,
    status: this.status,
    error: this.error,
    startedAt: this.startedAt,
    resumedAt: this.resumedAt,
    pausedAt: this.pausedAt,
    stoppedAt: this.stoppedAt,
    finishedAt: this.finishedAt,
    errorAt: this.errorAt
  })
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
