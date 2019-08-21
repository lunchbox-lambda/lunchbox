import { TYPES, inject, injectable } from 'lib/inversify';
import { EnvironmentService } from 'services/environments';
import { CommandCenter } from 'kernel/command-center';
import { RecipeCommand } from 'models';
import { Service } from '../service';

@injectable()
export class DefaultEnvironmentService extends Service implements EnvironmentService {
  @inject(TYPES.CommandCenter) private commandCenter: CommandCenter

  public async getEnvironmentData() {
    return [];
  }

  public async commandRecipe(environment: string, command: string, recipeId?: string) {
    let recipeCommand: RecipeCommand;

    switch (command) {
      case 'start':
        recipeCommand = RecipeCommand.START;
        break;

      case 'resume':
        recipeCommand = RecipeCommand.RESUME;
        break;

      case 'stop':
        recipeCommand = RecipeCommand.STOP;
        break;

      case 'pause':
        recipeCommand = RecipeCommand.PAUSE;
        break;

      case 'eject':
        recipeCommand = RecipeCommand.EJECT;
        break;

      default: throw new Error('Invalid command');
    }

    this.commandCenter.commandRecipe(environment, recipeCommand, recipeId);
  }
}
