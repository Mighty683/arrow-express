import { ControllerConfiguration, ControllerHandler } from "../controller/controller";
import { RouteConfiguration } from "../types";
export class AppConfigurator {
  private _prefix = "";
  private readonly _controllers: ControllerConfiguration<any>[] = [];
  private readonly logRequests: boolean;

  /**
   * Create AppConfigurator
   * @param expressApplication - express application
   * @param logRequests - flag if requests should be logged, true by default
   */
  constructor(logRequests = true) {
    this.logRequests = logRequests;
  }

  /**
   * Register prefix for all paths in application
   * @param prefix - prefix string eg: 'api'
   */
  prefix(prefix: string): AppConfigurator {
    this._prefix = prefix;
    return this;
  }

  getPrefix(): string {
    return this._prefix;
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

  getControllers(): ControllerConfiguration<any>[] {
    return this._controllers;
  }

  /**
   * @description
   * Build routes from registered controllers.
   * It will create route configuration for each controller and its sub-controllers.
   * The route configuration will include the path, method, and handler for each route.
   * The handler will call the controller's handler and then the route's request handler.
   * If the controller has sub-controllers, it will recursively build routes for them as well.
   * @returns Array of route configurations built from registered controllers.
   */
  buildRoutes(): RouteConfiguration[] {
    return this._controllers.reduce<RouteConfiguration[]>(
      (routes, controller) => routes.concat(this.reduceController(controller, this._prefix)),
      []
    );
  }

  private reduceController(
    controller: ControllerConfiguration<any, any>,
    path?: string,
    handler?: ControllerHandler
  ): RouteConfiguration[] {
    return controller
      .getRoutes()
      .map<RouteConfiguration>(route => {
        const routeConfiguration: RouteConfiguration = {
          path: AppConfigurator.getRoutePath(path || "", controller.getPrefix(), route.getPath()),
          method: route.getMethod(),
          handler: async (res, req, context) => {
            const currentContext = (await handler?.(res, req, context)) || context;
            const controllerContext = await controller.getHandler()?.(res, req, currentContext);

            return route.getRequestHandler()?.(res, req, controllerContext || currentContext);
          },
        };

        return routeConfiguration;
      })
      .concat(
        controller.getControllers().reduce((subRoutes, subController) => {
          return subRoutes.concat(
            this.reduceController(subController, controller.getPrefix(), async (res, req, context) => {
              const currentContext = (await handler?.(res, req, context)) || context;
              return controller.getHandler()?.(res, req, currentContext);
            })
          );
        }, [] as RouteConfiguration[])
      );
  }

  /**
   * Get final route path
   * @param paths - array of paths
   * @private
   */
  private static getRoutePath(...paths: string[]) {
    return paths.filter(path => !!path).join(`/`);
  }
}

export function Application(): AppConfigurator {
  return new AppConfigurator();
}
