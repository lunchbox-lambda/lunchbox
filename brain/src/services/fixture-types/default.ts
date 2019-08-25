import { injectable } from 'lib/inversify';
import { FixtureTypeService } from 'services/fixture-types';
import Service from '../service';

@injectable()
export default class DefaultFixtureTypeService extends Service implements FixtureTypeService {
  public async getFixtureTypes() {
    return this.repository.getFixtureTypes();
  }
}
