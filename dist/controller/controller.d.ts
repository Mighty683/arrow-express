import { RouteConfigurator } from "../route/route";
import Express from "express";
export type ControllerHandler<Context = undefined, RootContext = undefined> = (request: Express.Request, response: Express.Response, rootContext?: RootContext) => Promise<Context>;
export declare class ControllerConfiguration<Context = undefined, RootContext = undefined> {
    private _prefix;
    private _controllers;
    private _routes;
    private _handler;
    /**
     * Register child controller in controller
     * @param controller - controller to register
     */
    registerController(controller: ControllerConfiguration<any, Context>): this;
    /**
     * Register array of controllers in controller
     * @param controllers - routes used in controller
     */
    registerControllers(...controllers: ControllerConfiguration<any>[]): this;
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    registerRoute(route: RouteConfigurator<Context, any>): this;
    /**
     * Register array of routes in controller
     * @param routes - routes used in controller
     */
    registerRoutes(...routes: RouteConfigurator<Context, any>[]): this;
    /**
     * Register controller prefix which will be used by all routes
     * @param prefix - eg: 'login'
     */
    prefix(prefix: string): this;
    /**
     * Register controller handler which will be used by all routes
     * @param handler - ControllerHandler function
     */
    handler<NewContext>(handler: ControllerHandler<NewContext, RootContext>): ControllerConfiguration<NewContext, RootContext>;
    getPrefix(): string;
    getRoutes(): RouteConfigurator<Context>[];
    getControllers(): ControllerConfiguration<any, Context>[];
    getHandler(): ControllerHandler<Context, RootContext> | undefined;
}
export declare function Controller<C = undefined, R = undefined>(): ControllerConfiguration<C, R>;
