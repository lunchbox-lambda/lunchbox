import { injectable } from '../lib/inversify';
import EntityService from '../services/entity';
import { IFixtureTypeService } from '../services';
import FixtureType from '../models/fixture-type';

@injectable()
export default class FixtureTypeService extends EntityService<FixtureType> implements IFixtureTypeService {
  public constructor() {
    super(FixtureType, 'api/v1/fixture-types');
  }
}
