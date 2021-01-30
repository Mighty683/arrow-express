import Express from 'express';

import {ControllerConfiguration} from '../controller/controller';
import {RequestHandler, RouteConfigurator} from '../route/route';
import {ApiError} from '../error/apiErrorResponse';

export class AppConfigurator {
  private readonly _express: Express.Application
  private readonly _controllers: ControllerConfiguration[] = [];
  private readonly port: number
  constructor(port: number, app: Express.Application) {
    this._express = app;
    this.port = port;
  }

  private static getRoutePath(prefix: string, path: string) {
    const prefixPath = prefix ? `/${prefix}` : '/';
    const routePath = path ? `${prefix ? `/${path}` : path}` : '';
    return prefixPath + routePath;
  }

  private registerRoute(controller: ControllerConfiguration, route: RouteConfigurator) {
    this._express[route.getMethod()](
      AppConfigurator.getRoutePath(
        controller.getPrefix(),
        route.getPath()),
      async (req: Express.Request, res: Express.Response) => {
        await AppConfigurator.handleRequest(req, res, route.getRequestHandler());
      }
    );
  }

  private static async handleRequest (req: Express.Request, res: Express.Response, requestHandler: RequestHandler): Promise<void> {
    try {
      const response = await requestHandler(req, res);
      if (!res.writableEnded) {
        res.status(200).send(response);
      }
    } catch(error) {
      if (!res.writableEnded) {
        if (error instanceof ApiError) {
          res.status(error.httpCode || 500).send(error.response || 'Internal error');
        }
        res.status(500).send('Internal error');
      }
    }
  }

  private getExpressRoutesAsStrings() {
    return this._express._router.stack
      .filter(r => r.route)
      .map(r => `${Object.keys(r.route.methods)[0].toUpperCase()}:${r.route?.path}`);
  }

  /**
   * Register controller in application.
   * @param controller - registered controller
   */
  registerController(controller: ControllerConfiguration): AppConfigurator {
    this._controllers.push(controller);
    return this;
  }

  /**
   * Starts application, register controllers routes in express app
   * and connect to configured port
   */
  start(): void {
    this._controllers.forEach(controller => {
      controller.getRoutes().forEach(route => {
        this.registerRoute(controller, route);
      });
    });

    this._express.listen(this.port, async () => {
      console.log(`App started on port ${this.port}`);
      console.log('Routes registered by Express server:');
      this.getExpressRoutesAsStrings().forEach(console.log);
    });
  }
}

type ApplicationOptions = {
  port: number,
  app: Express.Application
}

/**
 * Creates application core
 * @param options.port - port used by application
 * @param options.app - Express application used by application
 */
export function Application(options: ApplicationOptions): AppConfigurator {
  return new AppConfigurator(options.port, options.app);
}