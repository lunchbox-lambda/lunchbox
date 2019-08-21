import { Subject, Observable } from 'rxjs';
import { synthesizeVariable } from 'lib/tools';

export abstract class Actuator<T> {
  public active: boolean
  protected actuator: T
  private _inputs: string[]

  public subject: Subject<ActuatorState>
  protected observable: Observable<ActuatorState>

  public constructor(
    public id: string,
    public pin: number | string,
    public env: string,
  ) {
    this.active = false;
    this.subject = new Subject<ActuatorState>();
    this.observable = (this.subject as Observable<ActuatorState>)
      .distinctUntilChanged((p, q) => p.state === q.state)
      .do((value) => {
        if (value.state === 'on') this.active = true;
        else if (value.state === 'off') this.active = false;
      });
  }

  public init() { }

  public get inputs() {
    return this._inputs;
  }

  public set inputs(inputs: string[]) {
    this._inputs = inputs.map((variable) =>
      synthesizeVariable(this.env, variable),
    );
  }
}

export class ActuatorState {
  public constructor(public state: 'on' | 'off') { }
}
