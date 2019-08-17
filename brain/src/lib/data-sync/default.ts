import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import config from 'config';
import logger from 'lib/logger';
import { DataSync } from 'lib/data-sync';
import { Repository } from 'lib/repository';
import { JSONValidator } from 'lib/json-validator';
import { TYPES, inject, injectable } from 'lib/inversify';

const log = logger('lib:data-sync');

interface SyncItem {
  type: string;
  schemaKey: string;
  fn: (data: any) => Promise<void>;
}

@injectable()
export class DefaultDataSync implements DataSync {

  @inject(TYPES.Repository) private repository: Repository
  @inject(TYPES.JSONValidator) private validator: JSONValidator

  private assetsDir: string
  private items = [
    {
      type: 'variables',
      schemaKey: 'variable',
      fn: (data) => this.repository.setVariables(data)
    },
    {
      type: 'fixture-types',
      schemaKey: 'fixture-type',
      fn: (data) => this.repository.setFixtureTypes(data)
    },
    {
      type: 'recipes',
      schemaKey: 'recipe',
      fn: (data) => this.repository.setRecipes(data)
    }
  ] as SyncItem[]

  public async sync() {
    this.assetsDir = await this.createAssetsDirectory();

    await Promise.all(
      this.items.map(item => this.doSync(item))
    );
  }

  private async createAssetsDirectory() {
    const dir = path.resolve(config.projectDir, 'assets');
    const exists = fs.existsSync(dir);
    if (!exists) fs.mkdirSync(dir);
    return dir;
  }

  private async doSync(item: SyncItem) {
    try {
      const exists = await this.check(item);
      if (!exists) await this.clone(item);
      await this.pull(item);
      await this.import(item);
    }
    catch (error) { log(error.message, 'error'); }
  }

  private async check(item: SyncItem) {
    return new Promise<boolean>((resolve, reject) => {
      const dir = path.resolve(this.assetsDir, item.type);
      fs.access(dir, error => {
        if (error) resolve(false);
        else resolve(true);
      });
    });
  }

  private async clone(item: SyncItem) {
    log(`clone repository ${item.type}`);
    return new Promise((resolve, reject) => {
      const cwd = this.assetsDir;
      const repo = `${config.git.baseUrl}/${item.type}.git`;
      const command = `git clone ${repo}`;
      exec(command, { cwd }, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private async pull(item: SyncItem) {
    log(`pull repository ${item.type}`);
    return new Promise((resolve, reject) => {
      const cwd = path.resolve(this.assetsDir, item.type);
      const command = `git pull`;
      exec(command, { cwd }, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private async import(item: SyncItem) {
    const libDir = path.resolve(this.assetsDir, item.type, 'lib');
    const files = fs.readdirSync(libDir);
    const data = [];

    for (let file of files) {
      try {
        const filePath = path.resolve(libDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);
        this.validator.validateThrow(json, item.schemaKey);
        data.push(json);
      }
      catch (error) { log(error.message, 'error'); }
    }

    await item.fn(data);
    log(`imported ${data.length} ${item.type}`);
  }

}
