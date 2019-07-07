import * as _ from 'lodash'
import { TYPES, inject, injectable, unmanaged } from '../lib/inversify'
import { IHttp } from '../lib/http'
import { Observable } from 'rxjs'
import { IEntityService } from '../services'
import { Entity, EntityOption } from '../models'

@injectable()
export abstract class EntityService<T extends Entity> implements IEntityService<T> {

  @inject(TYPES.Http)
  protected http: IHttp

  constructor(
    @unmanaged() private ctor: { new(): T },
    @unmanaged() protected url: string) { }

  query(): Observable<T[]> {
    return this.http.get(`${this.url}`)
      .map(json => _.map(json, n => _.create(this.ctor.prototype, n)))
  }

  options(): Observable<EntityOption[]> {
    return this.http.get(`${this.url}/options`)
      .map(json => _.map(json, n => _.create(EntityOption.prototype, n)))
  }

  get(id?: string): Observable<T> {
    return this.http.get(id ? `${this.url}/${id}` : `${this.url}`)
      .map(json => _.create(this.ctor.prototype, json))
  }

  upsert(entity: T): Observable<T> {
    throw ('Not implemented')
  }

  delete(entity: T): Observable<void> {
    throw ('Not implemented')
  }

}
