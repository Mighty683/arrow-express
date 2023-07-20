import { RouteConfigurator } from "../route/route";
import Express from "express";
export type ControllerHandler<C = undefined> = (request: Express.Request, response: Express.Response) => Promise<C>;
export declare class ControllerConfiguration<C = undefined> {
    private _prefix;
    private _controllers;
    private _routes;
    private _handler;
    /**
     * Register child controller in controller
     * @param controller - controller to register
     */
    registerController(controller: ControllerConfiguration): this;
    /**
     * Register array of controllers in controller
     * @param controllers - routes used in controller
     */
    registerControllers(...controllers: ControllerConfiguration[]): this;
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    registerRoute(route: RouteConfigurator<C>): this;
    /**
     * Register array of routes in controller
     * @param routes - routes used in controller
     */
    registerRoutes(...routes: RouteConfigurator<C>[]): this;
    /**
     * Register controller prefix which will be used by all routes
     * @param prefix - eg: 'login'
     */
    prefix(prefix: string): this;
    /**
     * Register controller handler which will be used by all routes
     * @param handler - ControllerHandler function
     */
    handler<NewContext>(handler: ControllerHandler<NewContext>): ControllerConfiguration<NewContext>;
    getPrefix(): string;
    getRoutes(): RouteConfigurator<C>[];
    getControllers(): ControllerConfiguration[];
    getHandler(): ControllerHandler<C> | undefined;
}
export declare function Controller<C = undefined>(): ControllerConfiguration<C>;
