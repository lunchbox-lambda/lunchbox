import { Container } from 'inversify';
import TYPES from './lib/types';

import { IHttp } from './lib/http';
import { IStore } from './lib/redux';
import { ISocket } from './lib/socket';
import { IVariableService } from './services';
import { IFixtureTypeService } from './services';
import { IRecipeService } from './services';
import { IComputerService } from './services';
import { IDiagnosticsService } from './services';
import { IEnvironmentService } from './services';

import Http from './lib/http';
import ReduxStore from './lib/redux';
import Socket from './lib/socket';
import VariableService from './services/variables';
import FixtureTypeService from './services/fixture-types';
import RecipeService from './services/recipes';
import ComputerService from './services/computer';
import DiagnosticsService from './services/diagnostics';
import EnvironmentService from './services/environment';

const container = new Container({ defaultScope: 'Singleton' });

container.bind<IHttp>(TYPES.Http).to(Http);
container.bind<IStore>(TYPES.Store).to(ReduxStore);
container.bind<ISocket>(TYPES.Socket).to(Socket);
container.bind<IVariableService>(TYPES.VariableService).to(VariableService);
container.bind<IFixtureTypeService>(TYPES.FixtureTypeService).to(FixtureTypeService);
container.bind<IRecipeService>(TYPES.RecipeService).to(RecipeService);
container.bind<IComputerService>(TYPES.ComputerService).to(ComputerService);
container.bind<IDiagnosticsService>(TYPES.DiagnosticsService).to(DiagnosticsService);
container.bind<IEnvironmentService>(TYPES.EnvironmentService).to(EnvironmentService);

export default container;
