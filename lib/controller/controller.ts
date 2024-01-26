import { RouteConfigurator } from "../route/route";
import Express from "express";

export type ControllerHandler<Context = undefined, RootContext = undefined> = (
  request: Express.Request,
  response: Express.Response,
  rootContext?: RootContext
) => Promise<Context>;

export class ControllerConfiguration<Context = undefined, RootContext = undefined> {
  private _prefix = "";
  private _controllers: ControllerConfiguration<unknown, Context>[] = [];
  private _routes: RouteConfigurator<Context>[] = [];
  private _handler: ControllerHandler<Context, RootContext> | undefined;

  /**
   * Register child controller in controller
   * @param controller - controller to register
   */
  registerController(controller: ControllerConfiguration<any, Context>): this {
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
  registerRoute(route: RouteConfigurator<Context, any>): this {
    this._routes.push(route);
    return this;
  }

  /**
   * Register array of routes in controller
   * @param routes - routes used in controller
   */
  registerRoutes(...routes: RouteConfigurator<Context, any>[]): this {
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
  handler<NewContext>(
    handler: ControllerHandler<NewContext, RootContext>
  ): ControllerConfiguration<NewContext, RootContext> {
    this._handler = handler as unknown as ControllerHandler<Context, RootContext>;
    return this as unknown as ControllerConfiguration<NewContext, RootContext>;
  }

  getPrefix(): string {
    return this._prefix;
  }

  getRoutes(): RouteConfigurator<Context>[] {
    return this._routes;
  }

  getControllers(): ControllerConfiguration<any, Context>[] {
    return this._controllers;
  }

  getHandler(): ControllerHandler<Context, RootContext> | undefined {
    return this._handler;
  }
}

export function Controller<C = undefined, R = undefined>(): ControllerConfiguration<C, R> {
  return new ControllerConfiguration<C, R>();
}
