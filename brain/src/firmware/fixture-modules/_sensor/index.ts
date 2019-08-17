import { Subject, Observable } from 'rxjs';
import { synthesizeVariable } from 'lib/tools';

export abstract class Sensor<T> {

  public static readFrequency = 15000

  public data: object
  protected sensor: T
  private _outputs: string[]

  private subject: Subject<SensorEvent>
  public observable: Observable<SensorEvent>

  constructor(
    public id: string,
    public pin: number | string,
    public env: string
  ) {
    this.data = {};
    this.subject = new Subject<SensorEvent>();
    this.observable = this.subject as Observable<SensorEvent>;
  }

  init() { }

  protected onSensorData(data: object) {
    this.data = data;
    for (const [key, value] of Object.entries(data)) {
      const event = new SensorEvent(
        this.id,
        synthesizeVariable(this.env, key),
        value
      );
      this.subject.next(event);
    }
  }

  get outputs() {
    return this._outputs;
  }

  set outputs(outputs: string[]) {
    this._outputs = outputs.map(variable =>
      synthesizeVariable(this.env, variable)
    );
  }
}

export class SensorEvent {

  public timestamp: Date = new Date()

  constructor(
    public sensorId: string,
    public variable: string,
    public value: number
  ) { }

}
