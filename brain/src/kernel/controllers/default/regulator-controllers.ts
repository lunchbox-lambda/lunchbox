import logger from 'lib/logger';
import * as moment from 'moment';
import * as parser from 'cron-parser';
import { Subscription } from 'rxjs';
import { ControllerState } from 'models';
import { Scheduler } from 'lib/scheduler';
import { Controller } from './controller';
import { Peripherals } from 'kernel/peripherals';
import { Regulator, RegulatorState } from 'firmware/fixture-modules/_regulator';

const log = logger('kernel:controllers');

export class RegulatorControllers {
  public constructor(
    private peripherals: Peripherals,
    private scheduler: Scheduler
  ) { }

  public async init() {
    const controllers: RegulatorController[] = [];

    const regulators = this.peripherals.regulators;

    regulators.forEach(regulator => {
      try {
        const { params } = regulator;

        if (!params)
          throw new Error(`Missing regulator params for ${regulator.id}.`);

        const { cron, duration, always } = params;

        let controller = null;

        if (cron && duration)
          controller = new PeriodicController(regulator, this.scheduler);

        else if (always)
          controller = new StaticController(regulator);

        else throw new Error(`Invalid regulator params for ${regulator.id}.`);

        controllers.push(controller);
        controller.reset();

        log(`created regulator ctrl ${controller.id}`);
      }
      catch (error) {
        log(`failed to create regulator ctrl ${regulator.id} - ${error.message}`, 'error');
      }
    });

    return controllers;
  }
}

abstract class RegulatorController extends Controller {
  public constructor(
    public regulator: Regulator<any>
  ) { super('regulator'); }

  public turnOn() {
    super.turnOn();

    const regulatorState = new RegulatorState('on');
    this.regulator.subject.next(regulatorState);
  }

  public turnOff() {
    super.turnOff();

    const regulatorState = new RegulatorState('off');
    this.regulator.subject.next(regulatorState);
  }

  public reset() {
    super.reset();

    const regulatorState = new RegulatorState('off');
    this.regulator.subject.next(regulatorState);
  }

  public status() {
    return super.status({
      active: [this.regulator].some(x => x.active),
      regulators: [this.regulator].map(x => x.id)
    });
  }
}

class StaticController extends RegulatorController {
  private initialized: boolean

  public spin() {
    if (this.initialized) return;
    this.initialized = true;
  }

  private setRegulatorState() {
    const { always } = this.regulator.params;
    const regulatorState = new RegulatorState(always);
    this.regulator.subject.next(regulatorState);
  }

  public reset() {
    super.reset();
    this.setRegulatorState();
  }
}

class PeriodicController extends RegulatorController {
  private cronSubscription: Subscription
  private durationSubscription: Subscription

  public constructor(
    regulator: Regulator<any>,
    private scheduler: Scheduler
  ) { super(regulator); }

  public spin() {
    if (this.cronSubscription) return;
    this.initCronJob();
  }

  private initCronJob() {
    const { cron, duration } = this.regulator.params;
    this.cronSubscription = this.scheduler.cron(() => {
      if (this.state != ControllerState.AUTOMATIC) return;
      this.setDurationTimer(moment.duration(duration).asMilliseconds());
      this.setRegulatorStateOn();
    }, cron);
  }

  private resumeCronJob() {
    const { cron, duration } = this.regulator.params;
    const now = new Date();
    const interval = parser.parseExpression(cron, { currentDate: now });
    const previous = interval.prev().toDate();
    const difference = now.getTime() - previous.getTime();
    const duration_ = moment.duration(duration).asMilliseconds();
    const left = duration_ - difference;

    if (left > 0) {
      this.setDurationTimer(left);
      this.setRegulatorStateOn();
    }
  }

  private setDurationTimer(ms: number) {
    if (this.durationSubscription)
      this.durationSubscription.unsubscribe();

    this.durationSubscription = this.scheduler.timeout(() => {
      if (this.state != ControllerState.AUTOMATIC) return;
      const regulatorState = new RegulatorState('off');
      this.regulator.subject.next(regulatorState);
    }, ms);
  }

  private setRegulatorStateOn() {
    const regulatorState = new RegulatorState('on');
    this.regulator.subject.next(regulatorState);
  }

  public reset() {
    super.reset();
    this.resumeCronJob();
  }
}
