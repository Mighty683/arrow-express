import { RouteConfigurator } from '../route/route';
export declare class ControllerConfiguration {
    private _prefix;
    private _controllers;
    private _routes;
    /**
     * Register child controller in controller
     * @param controller - controller to register
     */
    registerController(controller: ControllerConfiguration): ControllerConfiguration;
    /**
     * Register array of controllers in controller
     * @param controllers - routes used in controller
     */
    registerControllers(...controllers: ControllerConfiguration[]): ControllerConfiguration;
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    registerRoute(route: RouteConfigurator): ControllerConfiguration;
    /**
     * Register array of routes in controller
     * @param routes - routes used in controller
     */
    registerRoutes(...routes: RouteConfigurator[]): ControllerConfiguration;
    /**
     * Register controller prefix which will be used by all routes
     * @param prefix - eg: 'login'
     */
    prefix(prefix: string): ControllerConfiguration;
    getPrefix(): string;
    getRoutes(): RouteConfigurator[];
    getControllers(): ControllerConfiguration[];
}
export declare function Controller(): ControllerConfiguration;
