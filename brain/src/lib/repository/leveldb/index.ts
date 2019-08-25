import config from 'config';
import logger from 'lib/logger';
import { injectable } from 'inversify';
import { Repository } from 'lib/repository';
import Computer from 'models/computer';
import Fixture from 'models/fixture';
import FixtureType from 'models/fixture-type';
import Variable from 'models/variable';
import { Recipe } from 'models/recipe';
import { RecipeContext } from 'models/recipe';

const level = require('level');

const log = logger('backend:leveldb');

const RECIPES = 'recipes';
const COMPUTER = 'computer';
const VARIABLES = 'variables';
const FIXTURE_TYPES = 'fixture-types';
const RECIPE_CONTEXT = 'recipe-context';

@injectable()
export default class LevelDB implements Repository {
  private db: any

  public async init() {
    const { path } = config.leveldb;
    log(`init ${path}`);

    this.db = await level(path, {
      keyEncoding: 'utf8',
      valueEncoding: 'json',
    });
  }

  // Computer
  public async getComputer(): Promise<Computer> {
    return this.db.get(COMPUTER)
      .catch(() => null);
  }

  public async setComputer(computer: Computer): Promise<void> {
    return this.db.put(COMPUTER, computer);
  }

  public async updateComputerProperties(properties: any): Promise<Computer> {
    let computer = await this.db.get(COMPUTER);
    computer = Object.assign(computer, properties);
    await this.db.put(COMPUTER, computer);
    return computer;
  }

  public async updateComputerFixtures(fixtures: Fixture[]): Promise<Computer> {
    const computer = await this.db.get(COMPUTER);
    computer.fixtures = fixtures;
    await this.db.put(COMPUTER, computer);
    return computer;
  }

  // FixtureTypes
  public async getFixtureTypes(): Promise<FixtureType[]> {
    return this.db.get(FIXTURE_TYPES)
      .catch(() => []);
  }

  public async getFixtureTypesWithIds(ids: string[]): Promise<FixtureType[]> {
    return this.db.get(FIXTURE_TYPES)
      .then((fixtureTypes) => fixtureTypes.filter(
        (fixtureType) => ids.includes(fixtureType.id),
      ))
      .catch(() => []);
  }

  public async setFixtureTypes(fixtureTypes: FixtureType[]): Promise<void> {
    return this.db.put(FIXTURE_TYPES, fixtureTypes);
  }

  // Variables
  public async getVariables(): Promise<Variable[]> {
    return this.db.get(VARIABLES)
      .catch(() => []);
  }

  public async setVariables(variables: Variable[]): Promise<void> {
    return this.db.put(VARIABLES, variables);
  }

  // Recipes
  public async getRecipes(): Promise<Recipe[]> {
    return this.db.get(RECIPES)
      .catch(() => []);
  }

  public async setRecipes(recipes: Recipe[]): Promise<void> {
    return this.db.put(RECIPES, recipes);
  }

  public async getRecipe(id: string): Promise<Recipe> {
    return this.db.get(RECIPES)
      .then((recipes) => recipes.find(
        (recipe) => recipe.id === id,
      ))
      .catch(() => null);
  }

  public async getRecipeContext(environment: string): Promise<RecipeContext> {
    const key = `${RECIPE_CONTEXT}::${environment}`;
    return this.db.get(key)
      .catch(() => null);
  }

  public async upsertRecipeContext(context: RecipeContext): Promise<RecipeContext> {
    const key = `${RECIPE_CONTEXT}::${context.environment}`;
    return this.upsert<RecipeContext>(key, context);
  }

  // Environment
  public async getEnvironments(): Promise<string[]> {
    const computer = await this.getComputer();
    if (!computer || !computer.fixtures) return [];
    return [...new Set(
      computer.fixtures.map((fixture) => fixture.env),
    )];
  }

  //

  private async upsert<T>(key: string, value: T): Promise<T> {
    let _value = await this.db.get(key).catch(() => null);
    _value = { ..._value, ...value };
    await this.db.put(key, _value);
    return _value;
  }
}
