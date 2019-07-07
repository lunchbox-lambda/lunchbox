import { Action } from 'redux'
import { Observable } from 'rxjs'
import {
  Connectivity,
  Computer,
  Environment,
  RecipeContext
} from '../../models'

export interface IStore {
  dispatch(action: Action)
  getConnectivity(): Observable<Connectivity>
  getComputer(): Observable<Computer>
  getEnvironmentList(): Observable<string[]>
  getEnvironments(): Observable<{ [environment: string]: Environment }>
  getRecipeContexts(): Observable<{ [environment: string]: RecipeContext }>
}

export interface IStoreState {
  connectivity: Connectivity
  computer: Computer
  environmentList: string[]
  environments: { [environment: string]: Environment }
  recipeContexts: { [environment: string]: RecipeContext }
}
