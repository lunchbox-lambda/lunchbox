import { Container } from 'inversify'
import { TYPES } from 'lib/inversify'

const container = new Container({ defaultScope: 'Singleton' })

import { Broadcaster } from 'lib/broadcaster'
import { DefaultBroadcaster } from 'lib/broadcaster/default'
container.bind<Broadcaster>(TYPES.Broadcaster).to(DefaultBroadcaster)

import { ComputerInit } from 'lib/computer-init'
import { DefaultComputerInit } from 'lib/computer-init/default'
container.bind<ComputerInit>(TYPES.ComputerInit).to(DefaultComputerInit)

import { DataSync } from 'lib/data-sync'
import { DefaultDataSync } from 'lib/data-sync/default'
container.bind<DataSync>(TYPES.DataSync).to(DefaultDataSync)

import { JSONValidator } from 'lib/json-validator'
import { DefaultJSONValidator } from 'lib/json-validator/default'
container.bind<JSONValidator>(TYPES.JSONValidator).to(DefaultJSONValidator)

import { NodeRed } from 'lib/node-red'
import { DefaultNodeRed } from 'lib/node-red/default'
container.bind<NodeRed>(TYPES.NodeRed).to(DefaultNodeRed)

import { Repository } from 'lib/repository'
import { LevelDB } from 'lib/repository/leveldb'
container.bind<Repository>(TYPES.Repository).to(LevelDB)

import { Scheduler } from 'lib/scheduler'
import { DefaultScheduler } from 'lib/scheduler/default'
container.bind<Scheduler>(TYPES.Scheduler).to(DefaultScheduler)

import { ServiceHolder } from 'lib/service-holder'
import { DefaultServiceHolder } from 'lib/service-holder/default'
container.bind<ServiceHolder>(TYPES.ServiceHolder).to(DefaultServiceHolder)

import { Socket } from 'lib/socket'
import { SocketIO } from 'lib/socket/socket-io'
container.bind<Socket>(TYPES.Socket).to(SocketIO)



import { Firmware } from 'firmware'
import { DefaultFirmware } from 'firmware/default'
container.bind<Firmware>(TYPES.Firmware).to(DefaultFirmware)



import { CommandCenter } from 'kernel/command-center'
import { DefaultCommandCenter } from 'kernel/command-center/default'
container.bind<CommandCenter>(TYPES.CommandCenter).to(DefaultCommandCenter)

import { Controllers } from 'kernel/controllers'
import { DefaultControllers } from 'kernel/controllers/default'
container.bind<Controllers>(TYPES.Controllers).to(DefaultControllers)

import { Environment } from 'kernel/environment'
import { DefaultEnvironment } from 'kernel/environment/default'
container.bind<Environment>(TYPES.Environment).to(DefaultEnvironment)

import { Peripherals } from 'kernel/peripherals'
import { DefaultPeripherals } from 'kernel/peripherals/default'
container.bind<Peripherals>(TYPES.Peripherals).to(DefaultPeripherals)

import { Persistence } from 'kernel/persistence'
import { DefaultPersistence } from 'kernel/persistence/default'
container.bind<Persistence>(TYPES.Persistence).to(DefaultPersistence)

import { RecipeManager } from 'kernel/recipe-manager'
import { DefaultRecipeManager } from 'kernel/recipe-manager/default'
container.bind<RecipeManager>(TYPES.RecipeManager).to(DefaultRecipeManager)

import { Transmitter } from 'kernel/transmitter'
import { DefaultTransmitter } from 'kernel/transmitter/default'
container.bind<Transmitter>(TYPES.Transmitter).to(DefaultTransmitter)



import { CameraService } from 'services/cameras'
import { DefaultCameraService } from 'services/cameras/default'
container.bind<CameraService>(TYPES.CameraService).to(DefaultCameraService)

import { ComputerService } from 'services/computers'
import { DefaultComputerService } from 'services/computers/default'
container.bind<ComputerService>(TYPES.ComputerService).to(DefaultComputerService)

import { DiagnosticsService } from 'services/diagnostics'
import { DefaultDiagnosticsService } from 'services/diagnostics/default'
container.bind<DiagnosticsService>(TYPES.DiagnosticsService).to(DefaultDiagnosticsService)

import { EnvironmentService } from 'services/environments'
import { DefaultEnvironmentService } from 'services/environments/default'
container.bind<EnvironmentService>(TYPES.EnvironmentService).to(DefaultEnvironmentService)

import { FixtureTypeService } from 'services/fixture-types'
import { DefaultFixtureTypeService } from 'services/fixture-types/default'
container.bind<FixtureTypeService>(TYPES.FixtureTypeService).to(DefaultFixtureTypeService)

import { RecipeService } from 'services/recipes'
import { DefaultRecipeService } from 'services/recipes/default'
container.bind<RecipeService>(TYPES.RecipeService).to(DefaultRecipeService)

import { VariableService } from 'services/variables'
import { DefaultVariableService } from 'services/variables/default'
container.bind<VariableService>(TYPES.VariableService).to(DefaultVariableService)



import { WebApi } from 'webapi'
import { DefaultWebApi } from 'webapi/default'
container.bind<WebApi>(TYPES.WebApi).to(DefaultWebApi)

import { Router } from 'webapi/router'
import { DefaultRouter } from 'webapi/router/default'
container.bind<Router>(TYPES.Router).to(DefaultRouter)

export { container }
