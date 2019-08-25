import { Component } from 'lib/component';
import Environment from 'models/environment';

export interface EnvironmentService extends Component {
  getEnvironmentData(offset: number): Promise<Environment[]>;
  commandRecipe(environment: string, command: string, recipeId?: string): Promise<void>;
}
