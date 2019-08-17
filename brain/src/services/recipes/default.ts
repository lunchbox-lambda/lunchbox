import { injectable } from 'lib/inversify';
import { RecipeService } from 'services/recipes';
import { Service } from '../service';

@injectable()
export class DefaultRecipeService extends Service implements RecipeService {

  public async getRecipes() {
    return this.repository.getRecipes();
  }

  public async getRecipe(id: string) {
    return this.repository.getRecipe(id);
  }

}
