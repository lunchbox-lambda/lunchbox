import 'reflect-metadata'
import './inversify.config'
import configDefault, { IConfig } from './config'
import { container } from './inversify.config'
import { TYPES } from './lib/inversify'

import { IStore } from './lib/redux'
import { ISocket } from './lib/socket'

import {
  IVariableService,
  IFixtureTypeService,
  IRecipeService,
  IComputerService,
  IDiagnosticsService,
  IEnvironmentService
} from './services'

export * from './models'

export default function client(config: IConfig) {

  configDefault.serverHost = config.serverHost

  const socket = container.get<ISocket>(TYPES.Socket)

  return {
    store: container.get<IStore>(TYPES.Store),
    services: {
      variables: container.get<IVariableService>(TYPES.VariableService),
      fixtureTypes: container.get<IFixtureTypeService>(TYPES.FixtureTypeService),
      recipes: container.get<IRecipeService>(TYPES.RecipeService),
      computer: container.get<IComputerService>(TYPES.ComputerService),
      diagnostics: container.get<IDiagnosticsService>(TYPES.DiagnosticsService),
      environment: container.get<IEnvironmentService>(TYPES.EnvironmentService)

    }
  }

}
