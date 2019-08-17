import { Camera } from '../_camera';

export = class Default extends Camera<void> {

  public init() {
    super.init();

    setInterval(async () => {
      const image = await super.takeSnapshot();
      if (image) super.onCameraPicture(image);
    }, Camera.snapshotFrequency);
  }

}
