import { Container } from 'inversify';
import { TYPES } from './lib/types';
import { IHttp, Http } from './lib/http';
import { IStore, ReduxStore } from './lib/redux';
import { ISocket, Socket } from './lib/socket';
import { IVariableService, VariableService } from './services';
import { IFixtureTypeService, FixtureTypeService } from './services';
import { IRecipeService, RecipeService } from './services';
import { IComputerService, ComputerService } from './services';
import { IDiagnosticsService, DiagnosticsService } from './services';
import { IEnvironmentService, EnvironmentService } from './services';

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

export { container };
