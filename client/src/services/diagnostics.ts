import { Observable } from 'rxjs';
import { TYPES, inject, injectable } from '../lib/inversify';
import { IHttp } from '../lib/http';
import { IDiagnosticsService } from '../services';
import { Diagnostics } from '../models';

@injectable()
export class DiagnosticsService implements IDiagnosticsService {
  private url: string = 'api/v1/diagnostics'

  @inject(TYPES.Http)
  protected http: IHttp

  private observable: Observable<Diagnostics> =
  Observable
    .timer(0, 1000)
    .flatMap(() => this.http.get(`${this.url}`))

  public getDiagnostics(): Observable<Diagnostics> {
    return this.observable;
  }

  public getConsoleOutput(): Observable<string> {
    return this.http.get(`${this.url}/console-output`)
      .map((json) => json.data);
  }
}
