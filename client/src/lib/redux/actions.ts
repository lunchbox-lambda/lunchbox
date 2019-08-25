import Computer from '../../models/computer';
import Connectivity from '../../models/connectivity';
import Environment from '../../models/environment';
import { RecipeContext } from '../../models/recipe';

// Action Types
export const SET_CONNECTIVITY = 'SET_CONNECTIVITY';
export const SET_COMPUTER = 'SET_COMPUTER';
export const SET_ENVIRONMENT_LIST = 'SET_ENVIRONMENT_LIST';
export const SET_ENVIRONMENT = 'SET_ENVIRONMENT';
export const SET_RECIPE_CONTEXT = 'SET_RECIPE_CONTEXT';

// Action Creators
export const actions = {

  setConnectivity: (connectivity: Connectivity) => {
    return { type: SET_CONNECTIVITY, value: connectivity };
  },

  setComputer: (computer: Computer) => {
    return { type: SET_COMPUTER, value: computer };
  },

  setEnvironmentList: (environments: string[]) => {
    return { type: SET_ENVIRONMENT_LIST, value: environments };
  },

  setEnvironment: (environment: Environment) => {
    return { type: SET_ENVIRONMENT, value: environment };
  },

  setRecipeContext: (recipeContext: RecipeContext) => {
    return { type: SET_RECIPE_CONTEXT, value: recipeContext };
  },

};
