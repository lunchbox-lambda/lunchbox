import { Component } from 'lib/component';
import { Recipe } from 'models/recipe';

export interface RecipeService extends Component {
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe>;
}
