import { combineReducers, Action, AnyAction } from 'redux'
import { IStoreState } from './store'

import {
  Connectivity,
  Computer,
  Environment,
  RecipeContext
} from '../../models'

import {
  SET_CONNECTIVITY,
  SET_COMPUTER,
  SET_ENVIRONMENT_LIST,
  SET_ENVIRONMENT,
  SET_RECIPE_CONTEXT
} from './actions'

function connectivity(state = { broker: null, board: null, socket: null }, action: Action) {
  switch (action.type) {

    case SET_CONNECTIVITY: {
      const connectivity = action['value'] as Connectivity
      return Object.assign({}, state, connectivity)
    }

    default:
      return state
  }
}

function computer(state = null, action: Action) {
  switch (action.type) {

    case SET_COMPUTER: {
      const computer = action['value'] as Computer
      return Object.assign({}, state, computer)
    }

    default:
      return state
  }
}

function environmentList(state = null, action: Action) {
  switch (action.type) {

    case SET_ENVIRONMENT_LIST: {
      const environments = action['value'] as string[]
      return [...environments]
    }

    default:
      return state
  }
}

function environments(state = null, action: Action) {
  switch (action.type) {

    case SET_ENVIRONMENT: {
      const env = action['value'] as Environment
      const environment = env.environment
      return Object.assign({}, state, { [environment]: env })
    }

    default:
      return state
  }
}

function recipeContexts(state = null, action: Action) {
  switch (action.type) {

    case SET_RECIPE_CONTEXT: {
      const recipeContext = action['value'] as RecipeContext
      const environment = recipeContext.environment
      return Object.assign({}, state, { [environment]: recipeContext })
    }

    default:
      return state
  }
}

const reducers = combineReducers<IStoreState>({
  connectivity,
  computer,
  environmentList,
  environments,
  recipeContexts
})

export default reducers
