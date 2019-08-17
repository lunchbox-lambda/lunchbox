import logger from 'lib/logger';
import { injectable } from 'lib/inversify';
import { Persistence } from 'kernel/persistence';

const log = logger('kernel:persistence');

@injectable()
export class DefaultPersistence implements Persistence {

  // TODO: Implement Persistence
  async init() {
    log(`init skipped`);
  }

}
