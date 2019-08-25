import { combineReducers, AnyAction } from 'redux';
import { IStoreState } from './store';
import Computer from '../../models/computer';
import Connectivity from '../../models/connectivity';
import Environment from '../../models/environment';
import { RecipeContext } from '../../models/recipe';

import {
  SET_CONNECTIVITY,
  SET_COMPUTER,
  SET_ENVIRONMENT_LIST,
  SET_ENVIRONMENT,
  SET_RECIPE_CONTEXT,
} from './actions';

function connectivity(state = { broker: null, board: null, socket: null }, action: AnyAction) {
  switch (action.type) {
    case SET_CONNECTIVITY: {
      const connectivity = action.value as Connectivity;
      return { ...state, ...connectivity };
    }

    default:
      return state;
  }
}

function computer(state = null, action: AnyAction) {
  switch (action.type) {
    case SET_COMPUTER: {
      const computer = action.value as Computer;
      return { ...state, ...computer };
    }

    default:
      return state;
  }
}

function environmentList(state = null, action: AnyAction) {
  switch (action.type) {
    case SET_ENVIRONMENT_LIST: {
      const environments = action.value as string[];
      return [...environments];
    }

    default:
      return state;
  }
}

function environments(state = null, action: AnyAction) {
  switch (action.type) {
    case SET_ENVIRONMENT: {
      const env = action.value as Environment;
      const { environment } = env;
      return { ...state, [environment]: env };
    }

    default:
      return state;
  }
}

function recipeContexts(state = null, action: AnyAction) {
  switch (action.type) {
    case SET_RECIPE_CONTEXT: {
      const recipeContext = action.value as RecipeContext;
      const { environment } = recipeContext;
      return { ...state, [environment]: recipeContext };
    }

    default:
      return state;
  }
}

const reducers = combineReducers<IStoreState>({
  connectivity,
  computer,
  environmentList,
  environments,
  recipeContexts,
});

export default reducers;
