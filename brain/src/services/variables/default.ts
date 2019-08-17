import { injectable } from 'lib/inversify';
import { VariableService } from 'services/variables';
import { Service } from '../service';

@injectable()
export class DefaultVariableService extends Service implements VariableService {

  public async getVariables() {
    return this.repository.getVariables();
  }

}
