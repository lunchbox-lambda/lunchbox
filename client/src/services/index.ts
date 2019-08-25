import { Observable } from 'rxjs';

import Entity from '../models/entity';
import Variable from '../models/variable';
import FixtureType from '../models/fixture-type';
import Recipe from '../models/recipe';
import Computer from '../models/computer';
import Fixture from '../models/fixture';
import Diagnostics from '../models/diagnostics';

export interface IEntityService<T extends Entity> {
  query(): Observable<T[]>;
  options(): Observable<any[]>;
  get(id?: string): Observable<T>;
  upsert(entity: T): Observable<T>;
  delete(entity: T): Observable<void>;
}

export interface IVariableService extends IEntityService<Variable> {

}

export interface IFixtureTypeService extends IEntityService<FixtureType> {

}

export interface IRecipeService extends IEntityService<Recipe> {

}

export interface IComputerService extends IEntityService<Computer> {
  updateComputerFixtures(fixtures: Fixture[]): Observable<void>;
  restartComputer(): Observable<void>;
  getSettings(): Observable<object>;
  setSettings(settings: object): Observable<void>;
  commandController(command: string, controllerId: string): Observable<void>;
}

export interface IDiagnosticsService {
  getDiagnostics(): Observable<Diagnostics>;
  getConsoleOutput(): Observable<string>;
}

export interface ICameraService {

}

export interface IEnvironmentService {
  query(offset: number): Observable<any[]>;
  startRecipe(environment: string, recipeId: string): Observable<void>;
  stopRecipe(environment: string): Observable<void>;
  pauseRecipe(environment: string): Observable<void>;
  resumeRecipe(environment: string): Observable<void>;
  ejectRecipe(environment: string): Observable<void>;
}
