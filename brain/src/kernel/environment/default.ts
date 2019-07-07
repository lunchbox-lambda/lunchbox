import logger from 'lib/logger'
import { TYPES, inject, injectable } from 'lib/inversify'
import { Environment } from 'kernel/environment'
import { RecipeEventType } from 'kernel/recipe-manager/recipe-event'
import { Repository } from 'lib/repository'
import { Peripherals } from 'kernel/peripherals'
import { RecipeManager } from 'kernel/recipe-manager'
import {
  Computer, Variable,
  Environment as EnvironmentModel
} from 'models'
import { Scheduler } from 'lib/scheduler'
import { checkVariable, resolveVariable } from 'lib/tools'

const log = logger('kernel:environment')

@injectable()
export class DefaultEnvironment implements Environment {

  @inject(TYPES.Scheduler) private scheduler: Scheduler
  @inject(TYPES.Repository) private repository: Repository
  @inject(TYPES.Peripherals) private peripherals: Peripherals
  @inject(TYPES.RecipeManager) private recipeManager: RecipeManager

  computer: Computer
  variables: Map<string, Variable>
  environments: Array<string>
  sensorReadings: Map<string, number> = new Map()
  cameraPictures: Map<string, Buffer> = new Map()
  desiredValues: Map<string, number> = new Map()

  async init() {
    log(`init`)

    await this.loadComputer()
    await this.loadVariables()
    await this.loadEnvironments()

    await Promise.all([
      this.subscribeSensorEvents(),
      this.subscribeCameraEvents(),
      this.subscribeRecipeEvents()
    ])
  }

  private async loadComputer() {
    this.computer = await this.repository.getComputer()
    this.computer.timeZone = process.env.TZ

    const updateLocalTime = (function self() {
      this.computer.localTime = new Date()
      return self
    }).bind(this)()

    this.scheduler.interval(updateLocalTime.bind(this), 1000)
  }

  private async loadVariables() {
    const variables = await this.repository.getVariables()
    this.variables = new Map(variables.map<[string, Variable]>(x => [x.id, x]))
  }

  private async loadEnvironments() {
    this.environments = await this.repository.getEnvironments()
  }

  serializeForBroadcast(environment: string): EnvironmentModel {
    const filterValues = (map: Map<string, any>) => {
      return [...map.entries()]
        .reduce((result, [key, value]) => {
          if (checkVariable(environment, key)) {
            const variable = resolveVariable(key)
            result[variable] = value
          }
          return result
        }, {})
    }

    return {
      environment,
      sensorReadings: filterValues(this.sensorReadings),
      cameraPictures: filterValues(this.cameraPictures),
      desiredValues: filterValues(this.desiredValues)
    }
  }

  private async subscribeSensorEvents() {
    this.peripherals.sensorEvents.subscribe(
      event => {
        this.sensorReadings.set(event.variable, event.value)
      },
      error => { }
    )
  }

  private async subscribeCameraEvents() {
    this.peripherals.cameraEvents.subscribe(
      event => {
        this.cameraPictures.set(event.variable, event.image)
      },
      error => { }
    )
  }

  private async subscribeRecipeEvents() {
    this.recipeManager.recipeEvents.subscribe(
      event => {
        const { context, variableValues } = event
        const { environment } = context

        switch (event.eventType) {

          case RecipeEventType.OFFSET_CHANGED: {
            // Assign all the values for this environment
            const entries = [...variableValues.entries()]
            entries.forEach(([key, value]) => {
              this.desiredValues.set(key, value)
            })
          } break

          default: {
            // Remove all the values for this environment
            const keys = [...this.desiredValues.keys()]
              .filter(key => checkVariable(environment, key))
            keys.forEach(key => this.desiredValues.delete(key))
          } break
        }
      },
      error => { }
    )
  }

}
