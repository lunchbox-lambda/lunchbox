import Route, { RouteDeps } from '../route';

export = ({ router, services }: RouteDeps) => {
  router.get('/cameras/:variableName', Route.create({
    response: async ({ params }) => {
      const { variableName } = params;
      return services.cameras.getCameraPicture(variableName);
    },
  }));
}
