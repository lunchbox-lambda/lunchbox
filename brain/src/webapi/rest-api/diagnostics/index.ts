import { Route, RouteDeps } from '../route'

export = ({ router, services }: RouteDeps) => {

  router.get('/diagnostics', Route.create({
    response: async () => {
      return services.diagnostics.getDiagnostics()
    }
  }))

  router.get('/diagnostics/console-output', Route.create({
    response: async () => {
      const data = await services.diagnostics.getConsoleOutput()
      return { data }
    }
  }))

}
