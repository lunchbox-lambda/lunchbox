import { injectable } from '../lib/inversify'
import { Observable } from 'rxjs'
import { IComputerService, EntityService } from '../services'
import { Computer, Fixture } from '../models'

@injectable()
export class ComputerService extends EntityService<Computer> implements IComputerService {

  constructor() {
    super(Computer, 'api/v1/computer')
  }

  updateComputerFixtures(fixtures: Fixture[]): Observable<void> {
    return this.http.post(`${this.url}/fixtures`, fixtures)
  }

  restartComputer(): Observable<void> {
    return this.http.get(`${this.url}/restart`)
  }

  getSettings(): Observable<object> {
    return this.http.get(`${this.url}/settings`)
  }

  setSettings(settings: object): Observable<void> {
    return this.http.post(`${this.url}/settings`, settings)
  }

  commandController(command: string, controllerId: string): Observable<void> {
    return this.http.get(`${this.url}/controller/${controllerId}/${command}`)
  }

}
