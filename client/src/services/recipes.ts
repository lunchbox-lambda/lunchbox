import { injectable } from '../lib/inversify';
import EntityService from '../services/entity';
import { IRecipeService } from '../services';
import Recipe from '../models/recipe';

@injectable()
export default class RecipeService extends EntityService<Recipe> implements IRecipeService {
  public constructor() {
    super(Recipe, 'api/v1/recipes');
  }
}
