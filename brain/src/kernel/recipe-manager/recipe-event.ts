import { RecipeContext } from './recipe-context';

export enum RecipeEventType {
  NO_RECIPE_LOADED,
  RECIPE_STARTED,
  RECIPE_RESUMED,
  RECIPE_RUNNING,
  RECIPE_PAUSED,
  RECIPE_STOPPED,
  RECIPE_FINISHED,
  RECIPE_EJECTED,
  OFFSET_CHANGED,
  ERROR_OCCURED
}

export class RecipeEvent {
  public timestamp: Date = new Date()

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public context: RecipeContext,
    public eventType: RecipeEventType,
    public variableValues?: Map<string, number>) { }
}
