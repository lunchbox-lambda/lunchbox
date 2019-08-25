import { Component } from 'lib/component';
import { RecipeCommand } from 'models/recipe';
import { ControllerCommand } from 'models/controller';

export interface CommandCenter extends Component {
  restartComputer();
  commandRecipe(environment: string, command: RecipeCommand, recipeId?: string);
  commandController(command: ControllerCommand, controllerId: string);
}
