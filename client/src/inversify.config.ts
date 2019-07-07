import { Container } from 'inversify'
import { TYPES } from './lib/types'

const container = new Container({ defaultScope: 'Singleton' })

import { IHttp, Http } from './lib/http'
container.bind<IHttp>(TYPES.Http).to(Http)

import { IStore, ReduxStore } from './lib/redux'
container.bind<IStore>(TYPES.Store).to(ReduxStore)

import { ISocket, Socket } from './lib/socket'
container.bind<ISocket>(TYPES.Socket).to(Socket)

import { IVariableService, VariableService } from './services'
container.bind<IVariableService>(TYPES.VariableService).to(VariableService)

import { IFixtureTypeService, FixtureTypeService } from './services'
container.bind<IFixtureTypeService>(TYPES.FixtureTypeService).to(FixtureTypeService)

import { IRecipeService, RecipeService } from './services'
container.bind<IRecipeService>(TYPES.RecipeService).to(RecipeService)

import { IComputerService, ComputerService } from './services'
container.bind<IComputerService>(TYPES.ComputerService).to(ComputerService)

import { IDiagnosticsService, DiagnosticsService } from './services'
container.bind<IDiagnosticsService>(TYPES.DiagnosticsService).to(DiagnosticsService)

import { IEnvironmentService, EnvironmentService } from './services'
container.bind<IEnvironmentService>(TYPES.EnvironmentService).to(EnvironmentService)

export { container }
