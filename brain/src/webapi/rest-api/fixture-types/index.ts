import { Route, RouteDeps } from '../route';

export = ({ router, services }: RouteDeps) => {
  router.get('/fixture-types', Route.create({
    response: async () => {
      return services.fixtureTypes.getFixtureTypes();
    },
  }));
}
