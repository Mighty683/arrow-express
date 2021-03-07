import { RouteConfigurator } from '../route/route';
export declare class ControllerConfiguration {
    private _prefix;
    private _routes;
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    registerRoute(route: RouteConfigurator): ControllerConfiguration;
    /**
     * Register array of _routes in controller
     * @param routes - _routes used in controller
     */
    registerRoutes(...routes: RouteConfigurator[]): ControllerConfiguration;
    /**
     * Register controller prefix which will be used by all _routes
     * @param prefix - eg: 'login'
     */
    prefix(prefix: string): ControllerConfiguration;
    getPrefix(): string;
    getRoutes(): RouteConfigurator<unknown>[];
}
export declare function Controller(): ControllerConfiguration;
