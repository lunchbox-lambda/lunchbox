import { Component } from 'lib/component'
import { RecipeCommand, ControllerCommand } from 'models'

export interface CommandCenter extends Component {
  restartComputer()
  commandRecipe(environment: string, command: RecipeCommand, recipeId?: string)
  commandController(command: ControllerCommand, controllerId: string)
}
