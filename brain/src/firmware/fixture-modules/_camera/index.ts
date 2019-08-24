import { Subject, Observable } from 'rxjs';
import { exec } from 'child_process';
import { synthesizeVariable } from 'lib/tools';

export abstract class Camera<T> {
  public static snapshotFrequency = 5000

  public cameraPicture: Buffer
  public variable: string
  protected camera: T
  private _outputs: string[]

  private subject: Subject<CameraEvent>
  public observable: Observable<CameraEvent>

  public constructor(
    public id: string,
    public dev: string,
    public env: string,
  ) {
    this.cameraPicture = null;
    this.subject = new Subject<CameraEvent>();
    this.observable = this.subject as Observable<CameraEvent>;
  }

  public init() { }

  protected takeSnapshot(): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const variable = synthesizeVariable(this.env, this.variable);
      const command = `fswebcam -d ${this.dev} -r 800x600 -S 25 -q --gmt --title "${variable}" --save '-'`;
      exec(command, { encoding: 'buffer', maxBuffer: 512 * 2048 }, (error, stdout) => {
        if (error) reject(error);
        else if (stdout.length === 0) reject(new Error('No picture captured.'));
        else resolve(stdout);
      });
    }).catch(() => null);
  }

  protected onCameraPicture(image: Buffer) {
    this.cameraPicture = image;

    const event = new CameraEvent(
      this.id,
      synthesizeVariable(this.env, this.variable),
      image,
    );
    this.subject.next(event);
  }

  public get outputs() {
    return this._outputs;
  }

  public set outputs(outputs: string[]) {
    this._outputs = outputs.map((variable) =>
      synthesizeVariable(this.env, variable),
    );

    /* eslint-disable-next-line prefer-destructuring */
    this.variable = outputs[0];
  }
}

export class CameraEvent {
  public timestamp: Date = new Date()

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public cameraId: string,
    public variable: string,
    public image: Buffer,
  ) { }
}
