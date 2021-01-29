import {RouteConfigurator} from '../route/Route';

export class ControllerConfiguration {
  private _prefix: string
  private _routes: RouteConfigurator<unknown>[] = [];
  /**
   * Register route in controller
   * @param route - route used in controller
   */
  registerRoute(route: RouteConfigurator<unknown>): ControllerConfiguration {
    this._routes.push(route);
    return this;
  }

  /**
   * Register array of _routes in controller
   * @param _routes - _routes used in controller
   */
  registerRoutes(...routes: RouteConfigurator<unknown>[]): ControllerConfiguration {
    routes.forEach(route => this.registerRoute(route));
    return this;
  }
  /**
   * Register controller prefix which will be used by all _routes
   * @param prefix - eg: 'login'
   */
  prefix(prefix: string): ControllerConfiguration {
    this._prefix = prefix;
    return this;
  }

  getPrefix(): string {
    return this._prefix;
  }

  getRoutes(): RouteConfigurator<unknown>[] {
    return this._routes;
  }
}

export function Controller(): ControllerConfiguration {
  return new ControllerConfiguration();
}