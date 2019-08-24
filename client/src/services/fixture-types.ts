import { injectable } from '../lib/inversify';
import { IFixtureTypeService, EntityService } from '../services';
import { FixtureType } from '../models';

@injectable()
export class FixtureTypeService extends EntityService<FixtureType> implements IFixtureTypeService {
  public constructor() {
    super(FixtureType, 'api/v1/fixture-types');
  }
}
