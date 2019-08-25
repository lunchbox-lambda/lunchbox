import { Router } from 'express';
import { RequestHandler } from 'express';
import { Request, Response } from 'express';
import { ServiceHolder } from 'lib/service-holder';
import { JSONValidator } from 'lib/json-validator';

export interface RouteDeps {
  router: Router;
  services: ServiceHolder;
  validator: JSONValidator;
}

interface RouteArgs {
  authorize?: (props: RouteProps) => Promise<Error>;
  validate?: (props: RouteProps) => Promise<Error>;
  response: (props: RouteProps) => Promise<any>;
}

interface RouteProps {
  params: any;
  body: any;
}

export default class Route {
  public static create(args: RouteArgs): RequestHandler {
    const { authorize, validate, response } = args;
    const route = new Route(authorize, validate, response);
    return route.handler;
  }

  // eslint-disable-next-line no-useless-constructor
  private constructor(
    /* eslint-disable no-empty-pattern */
    private authorize = ({ }) => Promise.resolve<Error>(null),
    private validate = ({ }) => Promise.resolve<Error>(null),
    private response = ({ }) => Promise.resolve<any>(null),
  ) { }

  private get handler() {
    return async (req: Request, res: Response) => {
      try {
        const props = {
          params: req.params,
          body: req.body,
        };

        const authorizeError = await this.authorize(props);
        if (authorizeError) {
          return res.status(403).end(authorizeError.message);
        }

        const validateError = await this.validate(props);
        if (validateError) {
          return res.status(400).end(validateError.message);
        }

        const body = await this.response(props);
        if (!body) {
          return res.status(204).end();
        }

        res.send(body);
      } catch (error) {
        const { message } = error;
        res.status(500).end(message);
      }
    };
  }
}
