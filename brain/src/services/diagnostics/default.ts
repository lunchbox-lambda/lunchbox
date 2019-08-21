import * as fs from 'fs';
import * as path from 'path';
import config from 'config';
import { TYPES, inject, injectable } from 'lib/inversify';
import { Firmware } from 'firmware';
import { Peripherals } from 'kernel/peripherals';
import { Controllers } from 'kernel/controllers';
import { DiagnosticsService } from 'services/diagnostics';
import { Broadcaster } from 'lib/broadcaster';
import { Service } from '../service';

@injectable()
export class DefaultDiagnosticsService extends Service implements DiagnosticsService {
  @inject(TYPES.Firmware) private firmware: Firmware
  @inject(TYPES.Peripherals) private peripherals: Peripherals
  @inject(TYPES.Controllers) private controllers: Controllers
  @inject(TYPES.Broadcaster) private broadcaster: Broadcaster

  public async init() {
    await this.initConnectivityBroadcast();
  }

  private async initConnectivityBroadcast() {
    this.broadcaster.register('connectivity', this.getConnectivity.bind(this));
  }

  public async getDiagnostics() {
    return {
      peripherals: this.peripherals.status(),
      controllers: this.controllers.status(),
    };
  }

  public async getConnectivity() {
    return { broker: null, board: this.firmware.status };
  }

  public async getConsoleOutput() {
    const filePath = path.resolve(config.data.path, 'stdout.log');
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });
  }
}
