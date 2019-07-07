import { Entity, EntityOption } from './entity'
import { ISerializable } from './serializable'

export class Recipe extends Entity {
  name: string
  description?: string
  phases: {
    name: string
    cycles: number
    dayparts: {
      [K in 'dawn' | 'day' | 'dusk' | 'night']: {
        duration: string
        variables: {
          [variable: string]: number
        }
      }
    }
  }[]
}

export class RecipeOption extends EntityOption {

}

export class RecipeContext implements ISerializable {
  environment: string
  instanceId: string
  recipeId: string
  status: RecipeStatus
  error: string
  startedAt: Date
  resumedAt: Date
  pausedAt: Date
  stoppedAt: Date
  finishedAt: Date
  errorAt: Date

  progress?: number

  serialize?= () => ({
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
