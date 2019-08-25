import { injectable } from '../lib/inversify';
import EntityService from '../services/entity';
import { IVariableService } from '../services';
import Variable from '../models/variable';

@injectable()
export default class VariableService extends EntityService<Variable> implements IVariableService {
  public constructor() {
    super(Variable, 'api/v1/variables');
  }
}
