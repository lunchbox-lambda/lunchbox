import { injectable } from '../lib/inversify';
import { IVariableService, EntityService } from '../services';
import { Variable } from '../models';

@injectable()
export class VariableService extends EntityService<Variable> implements IVariableService {
  public constructor() {
    super(Variable, 'api/v1/variables');
  }
}
