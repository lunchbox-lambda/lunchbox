import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { TYPES, inject, injectable, unmanaged } from '../lib/inversify';
import { IHttp } from '../lib/http';
import { IEntityService } from '../services';
import { Entity, EntityOption } from '../models';

@injectable()
export abstract class EntityService<T extends Entity> implements IEntityService<T> {
  @inject(TYPES.Http)
  protected http: IHttp

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    @unmanaged() private ctor: { new(): T },
    @unmanaged() protected url: string) { }

  public query(): Observable<T[]> {
    return this.http.get(`${this.url}`)
      .map((json) => _.map(json, (n) => _.create(this.ctor.prototype, n)));
  }

  public options(): Observable<EntityOption[]> {
    return this.http.get(`${this.url}/options`)
      .map((json) => _.map(json, (n) => _.create(EntityOption.prototype, n)));
  }

  public get(id?: string): Observable<T> {
    return this.http.get(id ? `${this.url}/${id}` : `${this.url}`)
      .map((json) => _.create(this.ctor.prototype, json));
  }

  public upsert(): Observable<T> {
    throw new Error('Not implemented');
  }

  public delete(): Observable<void> {
    throw new Error('Not implemented');
  }
}
