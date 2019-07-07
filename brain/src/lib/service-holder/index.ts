import { CameraService } from 'services/cameras'
import { ComputerService } from 'services/computers'
import { DiagnosticsService } from 'services/diagnostics'
import { EnvironmentService } from 'services/environments'
import { FixtureTypeService } from 'services/fixture-types'
import { RecipeService } from 'services/recipes'
import { VariableService } from 'services/variables'

export interface ServiceHolder {
  cameras: CameraService
  computers: ComputerService
  diagnostics: DiagnosticsService
  environments: EnvironmentService
  fixtureTypes: FixtureTypeService
  recipes: RecipeService
  variables: VariableService
}
