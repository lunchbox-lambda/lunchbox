import { Route, RouteDeps } from '../route'

export = ({ router, services }: RouteDeps) => {
  router.get('/environment/:offset', Route.create({
    response: async ({ params }) => {
      return services.environments.getEnvironmentData(params.offset)
    }
  }))

  router.get('/environment/:environment/recipes/:command/:recipeId?', Route.create({
    response: async ({ params }) => {
      const { environment, command, recipeId } = params
      return services.environments.commandRecipe(environment, command, recipeId)
    }
  }))

}
