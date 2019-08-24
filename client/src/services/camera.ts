import { Observable } from 'rxjs';
import { TYPES, inject, injectable } from '../lib/inversify';
import { IHttp } from '../lib/http';
import { ICameraService } from '../services';

@injectable()
export class CameraService implements ICameraService {
  private url: string = 'api/v1/cameras'

  @inject(TYPES.Http)
  protected http: IHttp

  public constructor() { }

  public getCameraPicture(): Observable<Buffer> {
    return this.http.get(`${this.url}/image_general`);
    //     .map<any, string>(res => res.text())
  }
}
