import { Observable } from 'rxjs';
import { TYPES, inject, injectable } from '../lib/inversify';
import { IHttp } from '../lib/http';
import { IEnvironmentService } from '../services';

@injectable()
export class EnvironmentService implements IEnvironmentService {
  private url: string = 'api/v1/environment'

  @inject(TYPES.Http)
  protected http: IHttp

  public constructor() { }

  public query(offset: number): Observable<any> {
    return this.http.get(`${this.url}/${offset}`);
  }

  public startRecipe(environment: string, recipeId: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/start/${recipeId}`);
  }

  public stopRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/stop`);
  }

  public pauseRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/pause`);
  }

  public resumeRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/resume`);
  }

  public ejectRecipe(environment: string): Observable<void> {
    return this.http.get(`${this.url}/${environment}/recipes/eject`);
  }
}
