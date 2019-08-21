import logger from 'lib/logger';
import * as uuid from 'uuid-1345';
import { TYPES, inject, injectable } from 'lib/inversify';
import { ComputerInit } from 'lib/computer-init';
import { Repository } from 'lib/repository';
import { Computer } from 'models';

const log = logger('lib:computer-init');

@injectable()
export class DefaultComputerInit implements ComputerInit {
  @inject(TYPES.Repository) private repository: Repository

  public async init() {
    await this.createDefaultComputer();
    await this.updateComputerProperties();
  }

  private async createDefaultComputer() {
    let computer = await this.repository.getComputer();
    if (!computer) {
      log('create default computer');

      computer = new Computer();
      computer.createdAt = new Date();
      computer.fixtures = [];

      await this.repository.setComputer(computer.serialize());
    }
  }

  private async updateComputerProperties() {
    const { name, organization, uuid } = await this.resolveComputerProperties();
    const version = process.env.LBOX_VERSION;

    const properties = {
      name, organization, uuid, version,
      boardType: process.env.PLATFORMIO_BOARD_ID,
    };

    log(`set name to ${properties.name}`);
    log(`set organization to ${properties.organization}`);
    log(`set uuid to ${properties.uuid}`);
    log(`set board type to ${properties.boardType}`);

    await this.repository.updateComputerProperties(properties);
  }

  private async resolveComputerProperties() {
    const computerName = process.env.LBOX_COMPUTER_NAME;
    if (!computerName) throw new Error('Missing ENV LBOX_COMPUTER_NAME');

    const organizationName = 'lunchbox-lambda';

    const organizationUUID = uuid.v5({ namespace: uuid.namespace.x500, name: organizationName });
    const computerUUID = uuid.v5({ namespace: organizationUUID, name: computerName });

    return {
      name: computerName,
      organization: organizationName,
      uuid: computerUUID,
    };
  }
}
