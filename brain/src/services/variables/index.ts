import { Component } from 'lib/component';
import Variable from 'models/variable';

export interface VariableService extends Component {
  getVariables(): Promise<Variable[]>;
}
