import { TYPES, inject, injectable } from 'lib/inversify';
import { ServiceHolder } from 'lib/service-holder';

import { CameraService } from 'services/cameras';
import { ComputerService } from 'services/computers';
import { DiagnosticsService } from 'services/diagnostics';
import { EnvironmentService } from 'services/environments';
import { FixtureTypeService } from 'services/fixture-types';
import { RecipeService } from 'services/recipes';
import { VariableService } from 'services/variables';

@injectable()
export default class DefaultServiceHolder implements ServiceHolder {
  @inject(TYPES.CameraService) public cameras: CameraService
  @inject(TYPES.ComputerService) public computers: ComputerService
  @inject(TYPES.DiagnosticsService) public diagnostics: DiagnosticsService
  @inject(TYPES.EnvironmentService) public environments: EnvironmentService
  @inject(TYPES.FixtureTypeService) public fixtureTypes: FixtureTypeService
  @inject(TYPES.RecipeService) public recipes: RecipeService
  @inject(TYPES.VariableService) public variables: VariableService
}
