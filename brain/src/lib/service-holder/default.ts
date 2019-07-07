import { TYPES, inject, injectable } from 'lib/inversify'
import { ServiceHolder } from 'lib/service-holder'

import { CameraService } from 'services/cameras'
import { ComputerService } from 'services/computers'
import { DiagnosticsService } from 'services/diagnostics'
import { EnvironmentService } from 'services/environments'
import { FixtureTypeService } from 'services/fixture-types'
import { RecipeService } from 'services/recipes'
import { VariableService } from 'services/variables'

@injectable()
export class DefaultServiceHolder implements ServiceHolder {

  @inject(TYPES.CameraService) cameras: CameraService
  @inject(TYPES.ComputerService) computers: ComputerService
  @inject(TYPES.DiagnosticsService) diagnostics: DiagnosticsService
  @inject(TYPES.EnvironmentService) environments: EnvironmentService
  @inject(TYPES.FixtureTypeService) fixtureTypes: FixtureTypeService
  @inject(TYPES.RecipeService) recipes: RecipeService
  @inject(TYPES.VariableService) variables: VariableService

}
