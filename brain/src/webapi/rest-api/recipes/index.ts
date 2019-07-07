import { Route, RouteDeps } from '../route'

export = ({ router, services }: RouteDeps) => {

  router.get('/recipes', Route.create({
    response: async () => {
      return services.recipes.getRecipes()
    }
  }))

  router.get('/recipes/options', Route.create({
    response: async () => {
      const recipes = await services.recipes.getRecipes()
      return recipes.map(({ id, name }) => ({ id, name }))
    }
  }))

  router.get('/recipes/:id', Route.create({
    response: async ({ params }) => {
      return services.recipes.getRecipe(params.id)
    }
  }))

}
