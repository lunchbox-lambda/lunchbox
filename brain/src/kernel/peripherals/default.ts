import logger from 'lib/logger';
import { TYPES, inject, injectable } from 'lib/inversify';
import { Peripherals } from 'kernel/peripherals';
import { Subject, Observable } from 'rxjs';
import Computer from 'models/computer';
import FixtureType from 'models/fixture-type';
import { Firmware } from 'firmware';
import { Regulator } from 'firmware/fixture-modules/_regulator';
import { Actuator } from 'firmware/fixture-modules/_actuator';
import { Sensor, SensorEvent } from 'firmware/fixture-modules/_sensor';
import { Camera, CameraEvent } from 'firmware/fixture-modules/_camera';
import { Repository } from 'lib/repository';

const log = logger('kernel:peripherals');

@injectable()
export default class DefaultPeripherals implements Peripherals {
  @inject(TYPES.Firmware) private firmware: Firmware
  @inject(TYPES.Repository) private repository: Repository

  public sensors: Sensor<any>[] = []
  public actuators: Actuator<any>[] = []
  public regulators: Regulator<any>[] = []
  public cameras: Camera<any>[] = []

  private sensorSubject = new Subject<SensorEvent>()
  public sensorEvents = this.sensorSubject.asObservable()

  private cameraSubject = new Subject<CameraEvent>()
  public cameraEvents = this.cameraSubject.asObservable()

  public async init() {
    log('init');

    const computer = await this.repository.getComputer();
    const fixtureTypes = await this.loadFixtureTypes(computer);

    await this.initPeripherals(computer, fixtureTypes);
    await this.initObservables();
  }

  private async loadFixtureTypes(computer: Computer) {
    const { fixtures } = computer;
    const fixtureTypeIds = fixtures.map((fixture) => fixture.type);
    const fixtureTypes = await this.repository.getFixtureTypesWithIds(fixtureTypeIds);
    return new Map(fixtureTypes.map<[string, FixtureType]>((x) => [x.id, x]));
  }

  private async initPeripherals(computer: Computer, fixtureTypes: Map<string, FixtureType>) {
    return Promise.all(computer.fixtures.map(async (fixture) => {
      if (fixture.disabled) {
        log(`skipped fixture ${fixture.id} ${fixture.env} (disabled)`);
        return;
      }

      const { fixtureType, fixtureModule } =
        await this.loadFixtureModule(fixture.type, fixtureTypes);

      if (!fixtureType) {
        log(`skipped fixture ${fixture.id} ${fixture.env} (fixture type not found)`, 'error');
        return;
      }

      const mountPoint = fixture.pin === undefined ? fixture.dev : fixture.pin;
      /* eslint-disable-next-line new-cap */
      const peripheral = new fixtureModule(fixture.id, mountPoint, fixture.env);

      // The fixture is a sensor
      if (fixtureType.type === 'sensor') {
        const sensor = peripheral as Sensor<any>;
        sensor.outputs = fixtureType.outputs;
        this.sensors.push(sensor);

        if (this.firmware.board) sensor.init();
        log(`mounted sensor ${sensor.id} ${sensor.env} ${sensor.pin}`);
      }

      // The fixture is an actuator
      if (fixtureType.type === 'actuator') {
        const actuator = peripheral as Actuator<any>;
        actuator.inputs = fixtureType.inputs;
        this.actuators.push(actuator);

        if (this.firmware.board) actuator.init();
        log(`mounted actuator ${actuator.id} ${actuator.env} ${actuator.pin}`);
      }

      // The fixture is a regulator
      if (fixtureType.type === 'regulator') {
        const regulator = peripheral as Regulator<any>;
        regulator.params = fixture.params;
        this.regulators.push(regulator);

        if (this.firmware.board) regulator.init();
        log(`mounted regulator ${regulator.id} ${regulator.env} ${regulator.pin}`);
      }

      // The fixture is a camera
      if (fixtureType.type === 'camera') {
        const camera = peripheral as Camera<any>;
        camera.outputs = fixtureType.outputs;
        this.cameras.push(camera);

        camera.init();
        log(`mounted camera ${camera.id} ${camera.env} ${camera.dev}`);
      }
    }));
  }

  private async initObservables() {
    // Sensors
    const sensorObservables = this.sensors.map((sensor) => sensor.observable);
    Observable
      .merge(...sensorObservables)
      .filter((event) => !!event.sensorId)
      .subscribe(this.sensorSubject);

    // Cameras
    const cameraObservables = this.cameras.map((camera) => camera.observable);
    Observable
      .merge(...cameraObservables)
      .filter((event) => !!event.cameraId)
      .subscribe(this.cameraSubject);
  }

  private async loadFixtureModule(fixtureTypeId: string, fixtureTypes: Map<string, FixtureType>) {
    const fixtureType = fixtureTypes.get(fixtureTypeId);

    if (!fixtureType) {
      return { fixtureType: null, fixtureModule: null };
    }

    type FixtureModule = (id: string, mountPoint: number | string, env: string) => void;
    const fixtureModuleName = fixtureType.type === 'regulator' ? 'regulator' : fixtureType.id;
    const _fixtureModule = await import(`firmware/fixture-modules/${fixtureModuleName}`);
    const fixtureModule = _fixtureModule as FixtureModule;
    return { fixtureType, fixtureModule };
  }

  public status(): { sensors: any[]; actuators: any[]; regulators: any[]; cameras: any[] } {
    return {

      sensors: this.sensors.map(({ id, pin, env, data }) =>
        ({ id, pin, env, data }),
      ),

      actuators: this.actuators.map(({ id, pin, env, active }) =>
        ({ id, pin, env, active }),
      ),

      regulators: this.regulators.map(({ id, pin, env, active }) =>
        ({ id, pin, env, active }),
      ),

      cameras: this.cameras.map(({ id, dev, env, variable, cameraPicture }) =>
        ({ id, dev, env, variable, size: cameraPicture ? cameraPicture.length : 0 }),
      ),
    };
  }
}
