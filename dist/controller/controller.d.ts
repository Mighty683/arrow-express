import { RouteConfigurator } from "../route/route";
import Express from "express";
export type ControllerHandler<C = undefined, R = undefined> = (request: Express.Request, response: Express.Response, rootContext?: R) => Promise<C>;
export declare class ControllerConfiguration<C = undefined, R = undefined> {
    private _prefix;
    private _controllers;
    private _routes;
    private _handler;
    /**
     * Register child controller in controller
     * @param controller - controller to register
     */
    registerController(controller: ControllerConfiguration<any, C>): this;
    /**
     * Register array of controllers in controller
     * @param controllers - routes used in controller
     */
    registerControllers(...controllers: ControllerConfiguration<any>[]): this;
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    registerRoute(route: RouteConfigurator<C>): this;
    /**
     * Register array of routes in controller
     * @param routes - routes used in controller
     */
    registerRoutes(...routes: RouteConfigurator<C, R>[]): this;
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
    getRoutes(): RouteConfigurator<C>[];
    getControllers(): ControllerConfiguration<any, C>[];
    getHandler(): ControllerHandler<C, R> | undefined;
}
export declare function Controller<C = undefined, R = undefined>(): ControllerConfiguration<C, R>;
