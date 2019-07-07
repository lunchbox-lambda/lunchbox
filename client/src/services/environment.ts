import { TYPES, inject, injectable } from '../lib/inversify'
import { IHttp } from '../lib/http'
import { Observable } from 'rxjs'
import { IEnvironmentService } from '../services'

@injectable()
export class EnvironmentService implements IEnvironmentService {

  private url: string = 'api/v1/environment'

  @inject(TYPES.Http)
  protected http: IHttp

  constructor() { }

  query(offset: number): Observable<any> {
    return this.http.get(`${this.url}/${offset}`)
  }

  startRecipe(environment: string, recipeId: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/start/${recipeId}`)
  }

  stopRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/stop`)
  }

  pauseRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/pause`)
  }

  resumeRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/resume`)
  }

  ejectRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/eject`)
  }

}
