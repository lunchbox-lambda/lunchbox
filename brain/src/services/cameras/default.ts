import { TYPES, inject, injectable } from 'lib/inversify';
import { CameraService } from 'services/cameras';
import { Environment } from 'kernel/environment';
import Service from '../service';

@injectable()
export default class DefaultCameraService extends Service implements CameraService {
  @inject(TYPES.Environment) private environment: Environment

  public async getCameraPicture(variableName: string) {
    return new Promise<Buffer>((resolve, reject) => {
      const { cameraPictures } = this.environment;
      const cameraPicture = cameraPictures[variableName];

      if (cameraPicture) resolve(cameraPicture);
      else reject(new Error('Camera picture not available.'));
    });
  }
}
