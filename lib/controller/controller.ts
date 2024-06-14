import { RouteConfigurator } from "../route/route";
import Express from "express";

import { IsUndefinedOrNeverOrUnknown } from "../utils/types";

export type ControllerHandler<Context = unknown, RootContext = unknown> = (
  request: Express.Request,
  response: Express.Response,
  rootContext?: RootContext
) => Promise<Context>;
export class ControllerConfiguration<C = unknown, R = unknown> {
  private _prefix = "";
  private _controllers: ControllerConfiguration<any, GetFinalControllerContext<C, R>>[] = [];
  private _routes: RouteConfigurator<GetFinalControllerContext<C, R>>[] = [];
  private _handler: ControllerHandler<GetFinalControllerContext<C, R>, R> | undefined;

  /**
   * Register child controller in controller
   * @param controller - controller to register
   */
  registerController(controller: ControllerConfiguration<any, GetFinalControllerContext<C, R>>): this {
    this._controllers.push(controller);
    return this;
  }

  /**
   * Register array of controllers in controller
   * @param controllers - routes used in controller
   */
  registerControllers(...controllers: ControllerConfiguration<any, GetFinalControllerContext<C, R>>[]): this {
    controllers.forEach(this.registerController.bind(this));
    return this;
  }

  /**
   * Register route in controller
   * @param route - route used in controller
   */
  registerRoute(route: RouteConfigurator<GetFinalControllerContext<C, R>, any>): this {
    this._routes.push(route);
    return this;
  }

  /**
   * Register array of routes in controller
   * @param routes - routes used in controller
   */
  registerRoutes(...routes: RouteConfigurator<GetFinalControllerContext<C, R>, any>[]): this {
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
    this._handler = handler as unknown as ControllerHandler<GetFinalControllerContext<C, R>, R>;
    return this as unknown as ControllerConfiguration<NewContext, R>;
  }

  getPrefix(): string {
    return this._prefix;
  }

  getRoutes(): RouteConfigurator<GetFinalControllerContext<C, R>>[] {
    return this._routes;
  }

  getControllers(): ControllerConfiguration<any, GetFinalControllerContext<C, R>>[] {
    return this._controllers;
  }

  getHandler(): ControllerHandler<GetFinalControllerContext<C, R>, R> | undefined {
    return this._handler;
  }
}

export function Controller<C = unknown, R = unknown>(): ControllerConfiguration<GetFinalControllerContext<C, R>, R> {
  return new ControllerConfiguration<GetFinalControllerContext<C, R>, R>();
}

type GetFinalControllerContext<Context, RootContext> = IsUndefinedOrNeverOrUnknown<Context> extends true
  ? RootContext
  : Context;
