import logger from 'lib/logger';
import { Controllers } from 'kernel/controllers';
import { TYPES, inject, injectable } from 'lib/inversify';
import { Scheduler } from 'lib/scheduler';
import { Peripherals } from 'kernel/peripherals';
import { Environment } from 'kernel/environment';
import Controller from './controller';
import PIDControllers from './pid-controllers';
import RegulatorControllers from './regulator-controllers';

const log = logger('kernel:controllers');

@injectable()
export default class DefaultControllers implements Controllers {
  @inject(TYPES.Peripherals) private peripherals: Peripherals
  @inject(TYPES.Environment) private environment: Environment
  @inject(TYPES.Scheduler) private scheduler: Scheduler

  private controllers: Controller[] = []

  public async init() {
    log('init');

    const pidControllers = new PIDControllers(this.peripherals, this.environment);
    const regulatorControllers = new RegulatorControllers(this.peripherals, this.scheduler);

    this.controllers.push(...await pidControllers.init());
    this.controllers.push(...await regulatorControllers.init());

    this.scheduler.interval(() => this.spin(), 1000);
  }

  public turnOn(id: string) {
    this.controllers.find((x) => x.id === id).turnOn();
  }

  public turnOff(id?: string) {
    if (id) this.controllers.find((x) => x.id === id).turnOff();
    else this.controllers.forEach((x) => x.turnOff.call(x));
  }

  public reset(id?: string) {
    if (id) this.controllers.find((x) => x.id === id).reset();
    else this.controllers.forEach((x) => x.reset.call(x));
  }

  public status() {
    return this.controllers.map((x) => x.status());
  }

  private spin() {
    this.controllers.forEach((x) => x.spin.call(x));
  }
}
