import { Component } from 'lib/component'
import { Variable } from 'models'

export interface VariableService extends Component {
  getVariables(): Promise<Variable[]>
}

