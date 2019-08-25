import 'reflect-metadata';
import './inversify.config';
import configDefault, { IConfig } from './config';
import container from './inversify.config';
import { TYPES } from './lib/inversify';
import { IStore } from './lib/redux';
import { ISocket } from './lib/socket';

import {
  IVariableService,
  IFixtureTypeService,
  IRecipeService,
  IComputerService,
  IDiagnosticsService,
  IEnvironmentService,
} from './services';

import Computer from './models/computer';
import Connectivity from './models/connectivity';
import Controller from './models/controller';
import Diagnostics from './models/diagnostics';
import Environment from './models/environment';
import FixtureType from './models/fixture-type';
import Fixture from './models/fixture';
import Variable from './models/variable';
import Recipe, { RecipeOption, RecipeContext, RecipeCommand, RecipeStatus } from './models/recipe';

export default function client(config: IConfig) {
  configDefault.serverHost = config.serverHost;

  container.get<ISocket>(TYPES.Socket);

  return {
    store: container.get<IStore>(TYPES.Store),
    services: {
      variables: container.get<IVariableService>(TYPES.VariableService),
      fixtureTypes: container.get<IFixtureTypeService>(TYPES.FixtureTypeService),
      recipes: container.get<IRecipeService>(TYPES.RecipeService),
      computer: container.get<IComputerService>(TYPES.ComputerService),
      diagnostics: container.get<IDiagnosticsService>(TYPES.DiagnosticsService),
      environment: container.get<IEnvironmentService>(TYPES.EnvironmentService),

    },
  };
}

export {
  Computer, Connectivity, Controller, Diagnostics,
  Environment, FixtureType, Fixture, Variable,
  Recipe, RecipeOption, RecipeContext, RecipeCommand, RecipeStatus,
};
