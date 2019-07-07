import { Entity, EntityOption } from './entity'

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

export class RecipeContext {
  environment: string
  instanceId: string
  recipeId: string
  status: RecipeStatus
  startedAt: Date
  resumedAt: Date
  pausedAt: Date
  stoppedAt: Date
  finishedAt: Date
  errorAt: Date

  progress?: number
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
