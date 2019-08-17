import { injectable } from 'lib/inversify';
import { FixtureTypeService } from 'services/fixture-types';
import { Service } from '../service';

@injectable()
export class DefaultFixtureTypeService extends Service implements FixtureTypeService {

  async getFixtureTypes() {
    return this.repository.getFixtureTypes();
  }

}
