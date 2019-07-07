import config from 'config'
import logger from 'lib/logger'
const level = require('level')
import { injectable } from 'inversify'
import { Repository } from 'lib/repository'
import {
  Computer, Fixture, FixtureType,
  Variable, Recipe, RecipeContext
} from 'models'

const log = logger('backend:leveldb')

const RECIPES = 'recipes'
const COMPUTER = 'computer'
const VARIABLES = 'variables'
const FIXTURE_TYPES = 'fixture-types'
const RECIPE_CONTEXT = 'recipe-context'

@injectable()
export class LevelDB implements Repository {

  private db: any

  async init() {
    const path = config.leveldb.path
    log(`init ${path}`)

    this.db = await level(path, {
      keyEncoding: 'utf8',
      valueEncoding: 'json'
    })
  }

  // Computer
  async getComputer(): Promise<Computer> {
    return this.db.get(COMPUTER)
      .catch(error => null)
  }

  async setComputer(computer: Computer): Promise<void> {
    return this.db.put(COMPUTER, computer)
  }

  async updateComputerProperties(properties: any): Promise<Computer> {
    let computer = await this.db.get(COMPUTER)
    computer = Object.assign(computer, properties)
    await this.db.put(COMPUTER, computer)
    return computer
  }

  async updateComputerFixtures(fixtures: Fixture[]): Promise<Computer> {
    const computer = await this.db.get(COMPUTER)
    computer.fixtures = fixtures
    await this.db.put(COMPUTER, computer)
    return computer
  }

  // FixtureTypes
  async getFixtureTypes(): Promise<FixtureType[]> {
    return this.db.get(FIXTURE_TYPES)
      .catch(error => [])
  }

  async getFixtureTypesWithIds(ids: string[]): Promise<FixtureType[]> {
    return this.db.get(FIXTURE_TYPES)
      .then(fixtureTypes => fixtureTypes.filter(
        fixtureType => ids.includes(fixtureType.id)
      ))
      .catch(error => [])
  }

  async setFixtureTypes(fixtureTypes: FixtureType[]): Promise<void> {
    return this.db.put(FIXTURE_TYPES, fixtureTypes)
  }

  // Variables
  async getVariables(): Promise<Variable[]> {
    return this.db.get(VARIABLES)
      .catch(error => [])
  }

  async setVariables(variables: Variable[]): Promise<void> {
    return this.db.put(VARIABLES, variables)
  }

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    return this.db.get(RECIPES)
      .catch(error => [])
  }

  async setRecipes(recipes: Recipe[]): Promise<void> {
    return this.db.put(RECIPES, recipes)
  }

  async getRecipe(id: string): Promise<Recipe> {
    return this.db.get(RECIPES)
      .then(recipes => recipes.find(
        recipe => recipe.id === id
      ))
      .catch(error => null)
  }

  async getRecipeContext(environment: string): Promise<RecipeContext> {
    const key = `${RECIPE_CONTEXT}::${environment}`
    return this.db.get(key)
      .catch(error => null)
  }

  async upsertRecipeContext(context: RecipeContext): Promise<RecipeContext> {
    const key = `${RECIPE_CONTEXT}::${context.environment}`
    return this.upsert<RecipeContext>(key, context)
  }

  // Environment
  async getEnvironments(): Promise<string[]> {
    const computer = await this.getComputer()
    if (!computer || !computer.fixtures) return []
    return [...new Set(
      computer.fixtures.map(fixture => fixture.env)
    )]
  }

  ///

  private async upsert<T>(key: string, value: T): Promise<T> {
    let _value = await this.db.get(key).catch(error => null)
    _value = Object.assign({}, _value, value)
    await this.db.put(key, _value)
    return _value
  }

}
