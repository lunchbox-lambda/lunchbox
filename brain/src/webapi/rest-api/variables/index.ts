import { Route, RouteDeps } from '../route';

export = ({ router, services }: RouteDeps) => {
  router.get('/variables', Route.create({
    response: async () => {
      return services.variables.getVariables();
    }
  }));
}
