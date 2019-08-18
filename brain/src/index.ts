import 'reflect-metadata';
import 'inversify.config';
import { TYPES } from 'lib/inversify';
import { container } from 'inversify.config';

import { ComputerInit } from 'lib/computer-init';
import { DataSync } from 'lib/data-sync';
import { Repository } from 'lib/repository';
import { Scheduler } from 'lib/scheduler';

import { Firmware } from 'firmware';

import { CommandCenter } from 'kernel/command-center';
import { Controllers } from 'kernel/controllers';
import { Environment } from 'kernel/environment';
import { Peripherals } from 'kernel/peripherals';
import { Persistence } from 'kernel/persistence';
import { RecipeManager } from 'kernel/recipe-manager';
import { Transmitter } from 'kernel/transmitter';

import { CameraService } from 'services/cameras';
import { ComputerService } from 'services/computers';
import { DiagnosticsService } from 'services/diagnostics';
import { EnvironmentService } from 'services/environments';
import { FixtureTypeService } from 'services/fixture-types';
import { RecipeService } from 'services/recipes';
import { VariableService } from 'services/variables';

import { WebApi } from 'webapi';

const computerInit = container.get<ComputerInit>(TYPES.ComputerInit);
const dataSync = container.get<DataSync>(TYPES.DataSync);
const repository = container.get<Repository>(TYPES.Repository);
const scheduler = container.get<Scheduler>(TYPES.Scheduler);

const firmware = container.get<Firmware>(TYPES.Firmware);

const commandCenter = container.get<CommandCenter>(TYPES.CommandCenter);
const controllers = container.get<Controllers>(TYPES.Controllers);
const environment = container.get<Environment>(TYPES.Environment);
const peripherals = container.get<Peripherals>(TYPES.Peripherals);
const persistence = container.get<Persistence>(TYPES.Persistence);
const recipeManager = container.get<RecipeManager>(TYPES.RecipeManager);
const transmitter = container.get<Transmitter>(TYPES.Transmitter);

const cameras = container.get<CameraService>(TYPES.CameraService);
const computers = container.get<ComputerService>(TYPES.ComputerService);
const diagnostics = container.get<DiagnosticsService>(TYPES.DiagnosticsService);
const environments = container.get<EnvironmentService>(TYPES.EnvironmentService);
const fixtureTypes = container.get<FixtureTypeService>(TYPES.FixtureTypeService);
const recipes = container.get<RecipeService>(TYPES.RecipeService);
const variables = container.get<VariableService>(TYPES.VariableService);

const webApi = container.get<WebApi>(TYPES.WebApi);

async function init() {
  await repository.init();
  await computerInit.init();
  await dataSync.sync();

  await firmware.init();

  await environment.init();
  await peripherals.init();
  await controllers.init();
  await recipeManager.init();
  await persistence.init();
  await transmitter.init();
  await commandCenter.init();

  await cameras.init();
  await computers.init();
  await diagnostics.init();
  await fixtureTypes.init();
  await recipes.init();
  await variables.init();
  await environments.init();

  await scheduler.start();

  await webApi.init();
}

init();
