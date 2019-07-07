import { Subject, Observable } from 'rxjs'

export abstract class Regulator<T> {

  public active: boolean
  protected regulator: T
  private _params: {
    cron?: string,
    duration?: string,
    always?: 'on' | 'off'
  }

  public subject: Subject<RegulatorState>
  protected observable: Observable<RegulatorState>

  constructor(
    public id: string,
    public pin: number | string,
    public env: string
  ) {
    this.active = false
    this.subject = new Subject<RegulatorState>()
    this.observable = (this.subject as Observable<RegulatorState>)
      .distinctUntilChanged((p, q) => p.state === q.state)
      .do(value => {
        if (value.state === 'on') this.active = true
        else if (value.state === 'off') this.active = false
      })
  }

  init() { }

  get params() {
    return this._params
  }

  set params(params: {
    cron?: string,
    duration?: string,
    always?: 'on' | 'off'
  }) {
    this._params = params
  }

}

export class RegulatorState {

  constructor(public state: 'on' | 'off') { }

}
