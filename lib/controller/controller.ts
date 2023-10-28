import { RouteConfigurator } from "../route/route";
import Express from "express";

export type ControllerHandler<C = undefined, R = undefined> = (
  request: Express.Request,
  response: Express.Response,
  rootContext?: R
) => Promise<C>;

export class ControllerConfiguration<C = undefined, R = undefined> {
  private _prefix = "";
  private _controllers: ControllerConfiguration<unknown, C>[] = [];
  private _routes: RouteConfigurator<C>[] = [];
  private _handler: ControllerHandler<C, R> | undefined;

  /**
   * Register child controller in controller
   * @param controller - controller to register
   */
  registerController(controller: ControllerConfiguration<any, C>): this {
    this._controllers.push(controller);
    return this;
  }

  /**
   * Register array of controllers in controller
   * @param controllers - routes used in controller
   */
  registerControllers(...controllers: ControllerConfiguration<any>[]): this {
    controllers.forEach(this.registerController.bind(this));
    return this;
  }

  /**
   * Register route in controller
   * @param route - route used in controller
   */
  registerRoute(route: RouteConfigurator<C>): this {
    this._routes.push(route);
    return this;
  }

  /**
   * Register array of routes in controller
   * @param routes - routes used in controller
   */
  registerRoutes(...routes: RouteConfigurator<C, R>[]): this {
    routes.forEach(this.registerRoute.bind(this));
    return this;
  }
  /**
   * Register controller prefix which will be used by all routes
   * @param prefix - eg: 'login'
   */
  prefix(prefix: string): this {
    this._prefix = prefix;
    return this;
  }

  /**
   * Register controller handler which will be used by all routes
   * @param handler - ControllerHandler function
   */
  handler<NewContext>(handler: ControllerHandler<NewContext, R>): ControllerConfiguration<NewContext, R> {
    this._handler = handler as unknown as ControllerHandler<C, R>;
    return this as unknown as ControllerConfiguration<NewContext, R>;
  }

  getPrefix(): string {
    return this._prefix;
  }

  getRoutes(): RouteConfigurator<C>[] {
    return this._routes;
  }

  getControllers(): ControllerConfiguration<any, C>[] {
    return this._controllers;
  }

  getHandler(): ControllerHandler<C, R> | undefined {
    return this._handler;
  }
}

export function Controller<C = undefined, R = undefined>(): ControllerConfiguration<C, R> {
  return new ControllerConfiguration<C, R>();
}
