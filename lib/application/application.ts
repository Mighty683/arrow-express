import Express from "express";

import { ControllerConfiguration } from "../controller/controller";
import { RouteConfigurator } from "../route/route";
import { RequestError } from "../error/request.error";
import { ConfigurationError } from "../error/configuration.error";

export class AppConfigurator {
  private readonly _express: Express.Application;
  private readonly _controllers: ControllerConfiguration<any>[] = [];
  private readonly logRequests: boolean;
  private _configured: boolean;

  /**
   * Create AppConfigurator
   * @param expressApplication - express application
   * @param logRequests - flag if requests should be logged, true by default
   */
  constructor(expressApplication: Express.Application, logRequests = true) {
    this._express = expressApplication;
    this._configured = false;
    this.logRequests = logRequests;
  }

  /**
   * Starts application, register controllers routes in express app
   * and connect to configured port.
   * @param printConfiguration - print express application routes enabled by default.
   */
  configure(printConfiguration = true): void {
    if (this._configured) {
      throw new ConfigurationError("Cannot configure application multiple times");
    } else {
      this._configured = true;
    }
    this.startControllers();
    if (printConfiguration) {
      this.printExpressConfig();
    }
  }

  /**
   * Register controller in application.
   * @param controller - registered controller
   */
  registerController(controller: ControllerConfiguration<any, any>): AppConfigurator {
    this._controllers.push(controller);
    return this;
  }

  /**
   * Register list of controllers in application.
   * @param controllers - controllers to register
   */
  registerControllers(...controllers: ControllerConfiguration<any, any>[]): AppConfigurator {
    controllers.forEach(controller => this.registerController(controller));
    return this;
  }

  // PRIVATE

  private printExpressConfig() {
    console.log("Routes registered by Express server:");
    this.getExpressRoutesAsStrings().forEach(route => console.log(route));
  }

  private startControllers() {
    this._controllers.forEach(controller => this.startController(controller));
  }

  private startController(controller: ControllerConfiguration, controllersChain?: ControllerConfiguration[]) {
    if (!controllersChain) {
      controllersChain = [controller];
    } else {
      controllersChain.push(controller);
    }
    controller.getControllers().forEach(subController => {
      this.startController(subController, controllersChain);
    });
    controller.getRoutes().forEach(route => {
      this.registerRouteInExpress(controllersChain, route);
    });
  }

  private registerRouteInExpress(controllersChain: ControllerConfiguration[], route: RouteConfigurator) {
    const controllersPrefix = controllersChain.reduce(
      (prefixAcc, controller) => AppConfigurator.getRoutePath(prefixAcc, controller.getPrefix()),
      ""
    );
    const routePath = AppConfigurator.getRoutePath(controllersPrefix, route.getPath());

    if (!route.getMethod()) {
      throw new ConfigurationError(`Route ${routePath} has no method specified`);
    }

    this._express[route.getMethod()](`/${routePath}`, this.createApplicationRequestHandler(route, controllersChain));
  }

  private createApplicationRequestHandler(
    route: RouteConfigurator,
    controllersChain: ControllerConfiguration[]
  ): Express.RequestHandler {
    return async (req: Express.Request, res: Express.Response) => {
      try {
        let context: undefined;

        for (const controller of controllersChain) {
          const newContextValue = await controller.getHandler()?.(req, res, context);
          context = newContextValue ? newContextValue : context;
        }

        const response = await route.getRequestHandler()(req, res, context);
        if (AppConfigurator.canSendResponse(res)) {
          if (!res.statusCode) {
            res.status(200);
          }
          res.send(response);
        }
      } catch (error) {
        if (AppConfigurator.canSendResponse(res)) {
          if (error instanceof RequestError) {
            res.status(error.httpCode || 500).send(error.response || "Internal error");
          } else {
            res.status(500).send("Internal error");
          }
        }
      } finally {
        this.logRequest(req, res);
      }
    };
  }

  private logRequest(req: Express.Request, res: Express.Response) {
    if (this.logRequests) {
      console.log(`Request ${req.method}:${req.path} Response status: ${res.statusCode}`);
    }
  }

  private getExpressRoutesAsStrings() {
    return this._express._router.stack.filter(r => r.route).map(AppConfigurator.expressRouteAsString);
  }
  // STATIC

  private static expressRouteAsString(r) {
    return `${Object.keys(r.route.methods)[0].toUpperCase()}:${r.route?.path}`;
  }

  /**
   * Get final route path
   * @param paths - array of paths
   * @private
   */
  private static getRoutePath(...paths: string[]) {
    return paths.filter(path => !!path).join(`/`);
  }

  private static canSendResponse(res: Express.Response) {
    return !res.writableEnded;
  }
}

type ApplicationOptions = {
  app: Express.Application;
  logRequests?: boolean;
};

/**
 * Creates application core
 * @param options.app - Express application used by application
 * @param options.logRequests - log requests, enabled by default
 */
export function Application(options: ApplicationOptions): AppConfigurator {
  return new AppConfigurator(options.app, options.logRequests);
}
