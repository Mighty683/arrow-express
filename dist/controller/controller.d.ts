import { RouteConfigurator } from "../route/route";
import Express from "express";
export type ControllerHandler<Context = unknown, RootContext = unknown> = (request: Express.Request, response: Express.Response, rootContext?: RootContext) => Promise<Context>;
export declare class ControllerConfiguration<C = unknown, R = unknown> {
    private _prefix;
    private _controllers;
    private _routes;
    private _handler;
    /**
     * Register child controller in controller
     * @param controller - controller to register
     */
    registerController(controller: ControllerConfiguration<any, GetFinalControllerContext<C, R>>): this;
    /**
     * Register array of controllers in controller
     * @param controllers - routes used in controller
     */
    registerControllers(...controllers: ControllerConfiguration<any, GetFinalControllerContext<C, R>>[]): this;
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    registerRoute(route: RouteConfigurator<GetFinalControllerContext<C, R>, any>): this;
    /**
     * Register array of routes in controller
     * @param routes - routes used in controller
     */
    registerRoutes(...routes: RouteConfigurator<GetFinalControllerContext<C, R>, any>[]): this;
    /**
     * Register controller prefix which will be used by all routes
     * @param prefix - eg: 'login'
     */
    prefix(prefix: string): this;
    /**
     * Register controller handler which will be used by all routes
     * @param handler - ControllerHandler function
     */
    handler<NewContext>(handler: ControllerHandler<NewContext, R>): ControllerConfiguration<NewContext, R>;
    getPrefix(): string;
    getRoutes(): RouteConfigurator<GetFinalControllerContext<C, R>>[];
    getControllers(): ControllerConfiguration<any, GetFinalControllerContext<C, R>>[];
    getHandler(): ControllerHandler<GetFinalControllerContext<C, R>, R> | undefined;
}
export declare function Controller<C = unknown, R = unknown>(): ControllerConfiguration<GetFinalControllerContext<C, R>, R>;
type GetFinalControllerContext<Context, RootContext> = IsUnknown<Context> extends true ? RootContext : Context;
type IsUnknown<T> = unknown extends T ? (T extends unknown ? true : false) : false;
export {};
