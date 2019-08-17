import * as fs from 'fs';
import * as ini from 'ini';
import * as util from 'util';
import config from 'config';
import logger from 'lib/logger';
import { Firmware } from 'firmware';
import { Board } from 'johnny-five';
import { exec } from 'child_process';
import { Broadcaster } from 'lib/broadcaster';
import { Sensor } from 'firmware/fixture-modules/_sensor';
import { TYPES, inject, injectable } from 'lib/inversify';

const logPlatformio = logger('firmware:platformio');
const logBoard = logger('firmware:board');

interface PlatformioEnv {
  platform: string;
  board: string;
  framework: string;
}

@injectable()
export class DefaultFirmware implements Firmware {

  public board: Board = null
  private _status: boolean = null
  @inject(TYPES.Broadcaster) private broadcaster: Broadcaster

  public get status() {
    return this._status;
  }

  public set status(value: boolean) {
    this._status = value;
    this.broadcaster.broadcast('connectivity');
  }

  public async init() {
    if (!process.env.PLATFORMIO_BOARD_ID) {
      logBoard(`init skipped`);
    } else {
      logBoard(`init ${config.board.port}`);
      return new Promise<void>(async resolve => {
        try {
          await this.initPlatformio();
          await this.initFirmata();
          await this.initBoard();
        } catch (error) {
          this.board = null;
          logBoard(`ERROR: ${error.message}`);
        } finally {
          this.status = !!this.board;
          resolve();
        }
      });
    }
  }

  private async initPlatformio() {
    const boardId = process.env.PLATFORMIO_BOARD_ID;
    const filePath = `${config.platformio.path}/platformio.ini`;
    const readFile = util.promisify(fs.readFile);
    const content = await readFile(filePath, 'utf8');
    const platformioConfig = ini.parse(content);

    let platformioEnv: PlatformioEnv = null;
    for (let key in platformioConfig) {
      if (key.includes('env:')) {
        const value = platformioConfig[key] as PlatformioEnv;
        if (value.board === boardId) {
          platformioEnv = value;
          break;
        }
      }
    }

    if (platformioEnv) {
      const { platform, board, framework } = platformioEnv;
      logPlatformio(`${board} ${framework} ${platform}`);
    } else {
      logPlatformio(`init environment ${boardId}`);

      return new Promise((resolve, reject) => {

        const board = `--board ${boardId}`;
        const projectDir = `--project-dir ${config.platformio.path}`;
        const command = `platformio init ${board} ${projectDir}`;
        exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve();
        });

      });
    }
  }

  private async initFirmata() {
    logBoard(`firmata preflight`);

    return new Promise((resolve, reject) => {

      const command = 'node ./firmata-preflight';
      exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        if (!error) resolve();
        else {
          if (stderr) logBoard(stderr);

          logBoard(`compile and install firmata`);

          const boardId = process.env.PLATFORMIO_BOARD_ID;
          const environment = `--environment ${boardId}`;
          const target = `--target upload`;
          const uploadPort = `--upload-port ${config.board.port}`;
          const projectDir = `--project-dir ${config.platformio.path}`;
          const command = `platformio run ${environment} ${target} ${uploadPort} ${projectDir}`;
          exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve();
          });
        }
      });

    });
  }

  private async initBoard() {
    logBoard(`connecting to the board`);

    this.board = new Board({
      port: config.board.port,
      debug: false,
      repl: false
    });

    this.board.on('close', () => {
      logBoard(`close`);
      this.board = null;
      this.status = false;
    });

    return new Promise((resolve, reject) => {

      this.board.on('ready', () => {
        this.board.samplingInterval(Sensor.readFrequency);
        logBoard(`ready`);
        resolve();
      });

      this.board.on('error', (event?) => {
        reject(event);
      });

    });

  }

}
