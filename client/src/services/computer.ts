import { Observable } from 'rxjs';
import { injectable } from '../lib/inversify';
import { IComputerService, EntityService } from '../services';
import { Computer, Fixture } from '../models';

@injectable()
export class ComputerService extends EntityService<Computer> implements IComputerService {
  public constructor() {
    super(Computer, 'api/v1/computer');
  }

  public updateComputerFixtures(fixtures: Fixture[]): Observable<void> {
    return this.http.post(`${this.url}/fixtures`, fixtures);
  }

  public restartComputer(): Observable<void> {
    return this.http.get(`${this.url}/restart`);
  }

  public getSettings(): Observable<object> {
    return this.http.get(`${this.url}/settings`);
  }

  public setSettings(settings: object): Observable<void> {
    return this.http.post(`${this.url}/settings`, settings);
  }

  public commandController(command: string, controllerId: string): Observable<void> {
    return this.http.get(`${this.url}/controller/${controllerId}/${command}`);
  }
}
