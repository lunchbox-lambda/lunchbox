import logger from 'lib/logger';
import { TYPES, inject, injectable } from 'lib/inversify';
import { Environment } from 'kernel/environment';
import { RecipeEventType } from 'kernel/recipe-manager/recipe-event';
import { Repository } from 'lib/repository';
import { Peripherals } from 'kernel/peripherals';
import { RecipeManager } from 'kernel/recipe-manager';
import Computer from 'models/computer';
import Variable from 'models/variable';
import EnvironmentModel from 'models/environment';
import { Scheduler } from 'lib/scheduler';
import { checkVariable, resolveVariable } from 'lib/tools';

const log = logger('kernel:environment');

@injectable()
export default class DefaultEnvironment implements Environment {
  @inject(TYPES.Scheduler) private scheduler: Scheduler
  @inject(TYPES.Repository) private repository: Repository
  @inject(TYPES.Peripherals) private peripherals: Peripherals
  @inject(TYPES.RecipeManager) private recipeManager: RecipeManager

  public computer: Computer
  public variables: Map<string, Variable>
  public environments: string[]
  public sensorReadings: Map<string, number> = new Map()
  public cameraPictures: Map<string, Buffer> = new Map()
  public desiredValues: Map<string, number> = new Map()

  public async init() {
    log('init');

    await this.loadComputer();
    await this.loadVariables();
    await this.loadEnvironments();

    await Promise.all([
      this.subscribeSensorEvents(),
      this.subscribeCameraEvents(),
      this.subscribeRecipeEvents(),
    ]);
  }

  private async loadComputer() {
    this.computer = await this.repository.getComputer();
    this.computer.timeZone = process.env.TZ;

    const updateLocalTime = (function self() {
      this.computer.localTime = new Date();
      return self;
    }).bind(this)();

    this.scheduler.interval(updateLocalTime.bind(this), 1000);
  }

  private async loadVariables() {
    const variables = await this.repository.getVariables();
    this.variables = new Map(variables.map<[string, Variable]>((x) => [x.id, x]));
  }

  private async loadEnvironments() {
    this.environments = await this.repository.getEnvironments();
  }

  public serializeForBroadcast(environment: string): EnvironmentModel {
    const filterValues = (map: Map<string, any>) => {
      return [...map.entries()]
        .reduce((result, [key, value]) => {
          if (checkVariable(environment, key)) {
            const variable = resolveVariable(key);
            result[variable] = value;
          }
          return result;
        }, {});
    };

    return {
      environment,
      sensorReadings: filterValues(this.sensorReadings),
      cameraPictures: filterValues(this.cameraPictures),
      desiredValues: filterValues(this.desiredValues),
    };
  }

  private async subscribeSensorEvents() {
    this.peripherals.sensorEvents.subscribe(
      (event) => {
        this.sensorReadings.set(event.variable, event.value);
      },
    );
  }

  private async subscribeCameraEvents() {
    this.peripherals.cameraEvents.subscribe(
      (event) => {
        this.cameraPictures.set(event.variable, event.image);
      },
    );
  }

  private async subscribeRecipeEvents() {
    this.recipeManager.recipeEvents.subscribe(
      (event) => {
        const { context, variableValues } = event;
        const { environment } = context;

        switch (event.eventType) {
          case RecipeEventType.OFFSET_CHANGED: {
            // Assign all the values for this environment
            const entries = [...variableValues.entries()];
            entries.forEach(([key, value]) => {
              this.desiredValues.set(key, value);
            });
          } break;

          default: {
            // Remove all the values for this environment
            const keys = [...this.desiredValues.keys()]
              .filter((key) => checkVariable(environment, key));
            keys.forEach((key) => this.desiredValues.delete(key));
          } break;
        }
      },
    );
  }
}
