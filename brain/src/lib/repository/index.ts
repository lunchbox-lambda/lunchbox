import { Component } from 'lib/component';
import Computer from 'models/computer';
import Fixture from 'models/fixture';
import FixtureType from 'models/fixture-type';
import Variable from 'models/variable';
import { Recipe } from 'models/recipe';
import { RecipeContext } from 'models/recipe';

export interface Repository extends Component {

  // Computer
  getComputer(): Promise<Computer>;
  setComputer(computer: Computer): Promise<void>;
  updateComputerProperties(properties: any): Promise<Computer>;
  updateComputerFixtures(fixtures: Fixture[]): Promise<Computer>;

  // FixtureTypes
  getFixtureTypes(): Promise<FixtureType[]>;
  getFixtureTypesWithIds(ids: string[]): Promise<FixtureType[]>;
  setFixtureTypes(fixtureTypes: FixtureType[]): Promise<void>;

  // Variables
  getVariables(): Promise<Variable[]>;
  setVariables(variables: Variable[]): Promise<void>;

  // Recipes
  getRecipes(): Promise<Recipe[]>;
  setRecipes(recipes: Recipe[]): Promise<void>;
  getRecipe(id: string): Promise<Recipe>;
  getRecipeContext(environment: string): Promise<RecipeContext>;
  upsertRecipeContext(context: RecipeContext): Promise<RecipeContext>;

  // Environment
  getEnvironments(): Promise<string[]>;

}
