import {RouteConfigurator} from '../route/route';

export class ControllerConfiguration {
  private _prefix = ''
  private _controllers: ControllerConfiguration[] = [];
  private _routes: RouteConfigurator[] = [];

  /**
   * Register child controller in controller
   * @param controller - controller to register
   */
  registerController(controller: ControllerConfiguration): ControllerConfiguration {
    this._controllers.push(controller);
    return this;
  }


  /**
   * Register array of controllers in controller
   * @param controllers - routes used in controller
   */
  registerControllers(...controllers: ControllerConfiguration[]): ControllerConfiguration {
    controllers.forEach(this.registerController.bind(this));
    return this;
  }

  /**
   * Register route in controller
   * @param route - route used in controller
   */
  registerRoute(route: RouteConfigurator): ControllerConfiguration {
    this._routes.push(route);
    return this;
  }

  /**
   * Register array of routes in controller
   * @param routes - routes used in controller
   */
  registerRoutes(...routes: RouteConfigurator[]): ControllerConfiguration {
    routes.forEach(this.registerRoute.bind(this));
    return this;
  }
  /**
   * Register controller prefix which will be used by all routes
   * @param prefix - eg: 'login'
   */
  prefix(prefix: string): ControllerConfiguration {
    this._prefix = prefix;
    return this;
  }

  getPrefix(): string {
    return this._prefix;
  }

  getRoutes(): RouteConfigurator[] {
    return this._routes;
  }

  getControllers(): ControllerConfiguration[] {
    return this._controllers;
  }
}

export function Controller(): ControllerConfiguration {
  return new ControllerConfiguration();
}
