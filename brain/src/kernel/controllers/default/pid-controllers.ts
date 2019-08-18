import logger from 'lib/logger';
import { ControllerState } from 'models';
import { Controller } from './controller';
import { Peripherals } from 'kernel/peripherals';
import { Environment } from 'kernel/environment';
import { Sensor } from 'firmware/fixture-modules/_sensor';
import { Actuator, ActuatorState } from 'firmware/fixture-modules/_actuator';

const log = logger('kernel:controllers');

export class PIDControllers {
  public constructor(
    private peripherals: Peripherals,
    private environment: Environment
  ) { }

  public async init() {
    const controllers: PIDController[] = [];

    const sensors = this.peripherals.sensors;
    const sensorsByVariable = this.reducePeripheralsByVariable(sensors, 'outputs');
    const sensorVariables = Object.keys(sensorsByVariable);

    const actuators = this.peripherals.actuators;
    const actuatorsByVariable = this.reducePeripheralsByVariable(actuators, 'inputs');
    const actuatorVariables = Object.keys(actuatorsByVariable);

    const variables = new Set([...sensorVariables, ...actuatorVariables]);

    variables.forEach(variable => {
      try {
        const sensors = sensorsByVariable[variable];
        const actuators = actuatorsByVariable[variable];

        if (!!actuators) {
          const controller = new PIDController(variable, sensors, actuators, this.environment);
          controllers.push(controller);
          controller.reset();

          log(`created pid ctrl ${controller.id} ${controller.variable}`);
        }
      }
      catch (error) {
        log(`failed to create pid ctrl for ${variable} - ${error.message}`, 'error');
      }
    });

    return controllers;
  }

  private reducePeripheralsByVariable(peripherals: any[], key: string) {
    return peripherals.reduce((memo, peripheral) => {
      peripheral[key].forEach(variable => {
        const acc = memo[variable] || [];
        memo[variable] = acc;
        acc.push(peripheral);
      });
      return memo;
    }, {});
  }
}

class PIDController extends Controller {
  public constructor(
    public variable: string,
    public sensors: Sensor<any>[] = [],
    public actuators: Actuator<any>[] = [],
    private environment: Environment
  ) { super('pid'); }

  // Notation remarks
  //   pv = process variable, sensor value
  //   sp = setpoint, desired value    
  //   e = error value
  //   u = control variable    

  public spin() {
    if (this.state != ControllerState.AUTOMATIC) return;

    let pv = this.environment.sensorReadings[this.variable];
    let sp = this.environment.desiredValues[this.variable];

    if (pv === undefined) pv = 0;
    if (sp === undefined) return;

    const e = sp - pv;
    const Kp = 1;
    const Ki = 0;
    const Kd = 0;

    const u = Kp * e + Ki + Kd;

    this.actuators.forEach(actuator => {
      let actuatorState;

      if (u > 0) actuatorState = new ActuatorState('on');
      else actuatorState = new ActuatorState('off');

      actuator.subject.next(actuatorState);
    });
  }

  public turnOn() {
    super.turnOn();

    const actuatorState = new ActuatorState('on');
    this.actuators.forEach(actuator =>
      actuator.subject.next(actuatorState));
  }

  public turnOff() {
    super.turnOff();

    const actuatorState = new ActuatorState('off');
    this.actuators.forEach(actuator =>
      actuator.subject.next(actuatorState));
  }

  public reset() {
    super.reset();

    const actuatorState = new ActuatorState('off');
    this.actuators.forEach(actuator =>
      actuator.subject.next(actuatorState));
  }

  public status() {
    return super.status({
      variable: this.variable,
      active: this.actuators.some(x => x.active),
      sensors: this.sensors.map(x => x.id),
      actuators: this.actuators.map(x => x.id)
    });
  }
}
