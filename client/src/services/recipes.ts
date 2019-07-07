import { injectable } from '../lib/inversify'
import { IRecipeService, EntityService } from '../services'
import { Recipe } from '../models'

@injectable()
export class RecipeService extends EntityService<Recipe> implements IRecipeService {

  constructor() {
    super(Recipe, 'api/v1/recipes')
  }

}
