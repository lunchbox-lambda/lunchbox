import { TYPES, inject, injectable } from '../lib/inversify'
import { IHttp } from '../lib/http'
import { Observable } from 'rxjs'
import { ICameraService } from '../services'

@injectable()
export class CameraService implements ICameraService {

  private url: string = 'api/v1/cameras'

  @inject(TYPES.Http)
  protected http: IHttp

  constructor() { }

  getCameraPicture(): Observable<Buffer> {
    return this.http.get(`${this.url}/image_general`)
    //     .map<any, string>(res => res.text())
  }

}
