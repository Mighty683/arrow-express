import Express from 'express';

import {ControllerConfiguration} from '../controller/controller';
import {RequestHandler, RouteConfigurator} from '../route/route';
import {RequestError} from '../error/request.error';
import {ConfigurationError} from "../error/configuration.error";

export class AppConfigurator {
  private readonly _express: Express.Application
  private readonly _controllers: ControllerConfiguration[] = [];
  private readonly port: number
  private readonly logRequests: boolean;
  private _started: boolean

  /**
   *
   * @param port - port which will be used by application
   * @param expressApplication - express application
   * @param logRequests - flag if requests should be logged, true by default
   */
  constructor(
    port: number,
    expressApplication: Express.Application,
    logRequests = true
  ) {
    this._express = expressApplication;
    this._started = false;
    this.port = port;
    this.logRequests = logRequests;
  }


  /**
   * Starts application, register controllers routes in express app
   * and connect to configured port.
   */
  start(): void {
    if(this._started) {
      throw new ConfigurationError('Cannot start application multiple times');
    } else {
      this._started = true;
    }
    this.registerControllersInExpress();
    this.startExpressApplication();
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
   * Register list of controllers in application.
   * @param controllers - controllers to register
   */
  registerControllers(...controllers: ControllerConfiguration[]): AppConfigurator {
    controllers.forEach(controller => this.registerController(controller));
    return this;
  }

  // PRIVATE

  private startExpressApplication() {
    this._express.listen(this.port, async () => {
      console.log(`App started on port ${this.port}`);
      console.log('Routes registered by Express server:');
      this.getExpressRoutesAsStrings().forEach(route => console.log(route));
    });
  }

  private registerControllersInExpress() {
    this._controllers.forEach(controller => {
      controller.getRoutes().forEach(route => {
        this.registerRouteInExpress(controller, route);
      });
    });
  }

  private registerRouteInExpress(controller: ControllerConfiguration, route: RouteConfigurator) {
    const routePath = AppConfigurator.getRoutePath(
      controller.getPrefix(),
      route.getPath());

    if (!route.getMethod()) {
      throw new ConfigurationError(`Route ${routePath} has no method specified`);
    }

    this._express[route.getMethod()](
      routePath,
      this.createApplicationRequestHandler(route.getRequestHandler())
    );
  }

  private createApplicationRequestHandler(routeRequestHandler: RequestHandler): Express.RequestHandler {
    return async (req: Express.Request, res: Express.Response) => {
      try {
        const response = await routeRequestHandler(req, res);
        if (AppConfigurator.isResponseAlreadyEnded(res)) {
          if (!res.statusCode) {
            res.status(200);
          }
          res.send(response);
        }
      } catch(error) {
        if (AppConfigurator.isResponseAlreadyEnded(res)) {
          if (error instanceof RequestError) {
            res.status(error.httpCode || 500).send(error.response || 'Internal error');
          } else {
            res.status(500).send('Internal error');
            if (this.logRequests) {
              console.error('Internal error');
              console.error(error);
            }
          }
        }
      } finally {
        this.logRequest(req, res);
      }
    };
  }

  private logRequest(req: Express.Request, res: Express.Response) {
    if (this.logRequests) {
      console.log(`Request ${req.method}:${req.path} Response: ${res.statusCode}`);
    }
  }

  private getExpressRoutesAsStrings() {
    return this._express._router.stack
      .filter(r => r.route)
      .map(AppConfigurator.expressRouteAsString);
  }
  // STATIC



  private static expressRouteAsString(r) {
    return `${Object.keys(r.route.methods)[0].toUpperCase()}:${r.route?.path}`;
  }


  /**
   * Get final route path
   * @param prefix - prefix of route
   * @param path - path
   * @private
   */
  private static getRoutePath(prefix: string, path: string) {
    const prefixPath = prefix ? `/${prefix}` : '/';
    const routePath = path ? `${prefix ? `/${path}` : path}` : '';
    return prefixPath + routePath;
  }

  private static isResponseAlreadyEnded(res: Express.Response) {
    return !res.writableEnded;
  }
}

type ApplicationOptions = {
  port: number,
  app: Express.Application
  logRequests?: boolean
}

/**
 * Creates application core
 * @param options.port - port used by application
 * @param options.app - Express application used by application
 * @param options.logRequests - log requests, enabled by default
 */
export function Application(options: ApplicationOptions): AppConfigurator {
  return new AppConfigurator(options.port, options.app, options.logRequests);
}