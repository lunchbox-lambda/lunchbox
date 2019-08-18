import { Route, RouteDeps } from '../route';

export = ({ router, services, validator }: RouteDeps) => {
  router.get('/computer', Route.create({
    response: async () => {
      return services.computers.getComputer();
    }
  }));

  router.get('/computer/restart', Route.create({
    response: async () => {
      return services.computers.restartComputer();
    }
  }));

  router.get('/computer/settings', Route.create({
    response: async () => {
      return services.computers.getSettings();
    }
  }));

  router.post('/computer/settings', Route.create({
    validate: async ({ body }) => {
      return validator.validate(body, 'settings');
    },
    response: async ({ body }) => {
      return services.computers.setSettings(body);
    }
  }));

  router.get('/computer/controller/:controllerId/:command', Route.create({
    response: async ({ params }) => {
      const { controllerId, command } = params;
      return services.computers.commandController(command, controllerId);
    }
  }));

  router.post('/computer/fixtures', Route.create({
    validate: async ({ body }) => {
      return validator.validate(body, 'fixture', true);
    },
    response: async ({ body }) => {
      return services.computers.updateComputerFixtures(body);
    }
  }));
}
