import { Express as Express_2 } from 'express';

export declare class AppConfigurator {
    private _prefix;
    private readonly _controllers;
    private readonly logRequests;
    /**
     * Create AppConfigurator
     * @param expressApplication - express application
     * @param logRequests - flag if requests should be logged, true by default
     */
    constructor(logRequests?: boolean);
    /**
     * Register prefix for all paths in application
     * @param prefix - prefix string eg: 'api'
     */
    prefix(prefix: string): AppConfigurator;
    getPrefix(): string;
    /**
     * Register controller in application.
     * @param controller - registered controller
     */
    registerController(controller: ControllerConfiguration<any, any>): AppConfigurator;
    /**
     * Register list of controllers in application.
     * @param controllers - controllers to register
     */
    registerControllers(...controllers: ControllerConfiguration<any, any>[]): AppConfigurator;
    getControllers(): ControllerConfiguration<any>[];
    /**
     * @description
     * Build routes from registered controllers.
     * It will create route configuration for each controller and its sub-controllers.
     * The route configuration will include the path, method, and handler for each route.
     * The handler will call the controller's handler and then the route's request handler.
     * If the controller has sub-controllers, it will recursively build routes for them as well.
     * @returns Array of route configurations built from registered controllers.
     */
    buildRoutes(): RouteConfiguration[];
    private reduceController;
    /**
     * Get final route path
     * @param paths - array of paths
     * @private
     */
    private static getRoutePath;
}

export declare function Application(): AppConfigurator;

export declare namespace ArrowExpress {
    export interface InternalRequestType {
    }
    export interface InternalResponseType {
    }
}

export declare function Controller<C = unknown, R = unknown>(): ControllerConfiguration<GetFinalControllerContext<C, R>, R>;

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

export declare type ControllerHandler<Context = unknown, RootContext = unknown> = (request: ArrowExpress.InternalRequestType, response: ArrowExpress.InternalResponseType, rootContext?: RootContext) => Promise<Context>;

export declare const ExpressAdapter: (express: Express_2, appConfigurator: AppConfigurator) => ExpressAdapterConfiguration;

declare class ExpressAdapterConfiguration {
    private readonly _express;
    private readonly _appConfigurator;
    private _configured;
    constructor(express: Express_2, appConfigurator: AppConfigurator);
    private static expressRouteAsString;
    private registerRouteInExpress;
    private getExpressRoutesAsStrings;
    private printExpressConfig;
    private static canSendResponse;
    private createRequestHandler;
    /**
     * Starts application, register controllers routes in express app
     * and connect to configured port.
     * @param printConfiguration - print express application routes enabled by default.
     */
    configure(printConfiguration?: boolean): void;
}

declare type GetFinalControllerContext<Context, RootContext> = IsUndefinedOrNeverOrUnknown<Context> extends true ? RootContext : Context;

declare type HttpMethod = "get" | "post" | "head" | "put" | "delete" | "options" | "patch";

declare type IsNever<T> = [T] extends [never] ? true : false;

declare type IsUndefined<T> = undefined extends T ? (T extends undefined ? true : false) : false;

declare type IsUndefinedOrNeverOrUnknown<T> = IsUndefined<T> extends true ? true : IsNever<T> extends true ? true : IsUnknown<T> extends true ? true : false;

declare type IsUnknown<T> = unknown extends T ? (T extends unknown ? true : false) : false;

/**
 * Error type used by arrow-express to handle errors.
 */
export declare class RequestError extends Error {
    response?: Record<string, unknown>;
    httpCode: number;
    /**
     * RequestError constructor
     * @param httpCode - HTTP response code used by arrow-express default 500
     * @param response - response body send on error
     */
    constructor(httpCode?: number, response?: Record<string, unknown>);
}

export declare function Route<C = unknown, R = unknown>(): RouteConfigurator<C, R>;

export declare type RouteConfiguration = {
    /**
     * Merged path for the route, including the prefix if set.
     * @example 'api/users'
     */
    path: string;
    /**
     * HTTP method for the route, e.g., 'get', 'post', 'put', 'delete'.
     */
    method: string;
    /**
     * Handler function for the route.
     * It receives the request, response, and context as parameters.
     *
     * It's chain call of controllers and their sub-controllers and finally the route handler.
     * @param req - The request object.
     * @param res - The response object.
     * @param context - Additional context for the handler.
     */
    handler: (req: ArrowExpress.InternalRequestType, res: ArrowExpress.InternalResponseType, context: unknown) => Promise<unknown>;
};

export declare class RouteConfigurator<RootContext = unknown, Response = unknown> {
    private _method;
    private _path;
    private _handler;
    /**
     * Set method for route
     * @param method - Method
     */
    method(method: HttpMethod): this;
    /**
     * Register path of route alongside with prefix it is used to create full path
     * @param path
     */
    path(path: string): this;
    /**
     * Set request handler, here you can handle request
     * @param handler - RouteHandler
     */
    handler(handler: RouteHandler<RootContext, Response>): this;
    getMethod(): string;
    getPath(): string;
    /**
     * Get request handler function
     * @return - function which is called by express application on request
     */
    getRequestHandler(): RouteHandler<RootContext, Response>;
}

export declare type RouteHandler<RootContext = unknown, ResponseObject = unknown> = (request: ArrowExpress.InternalRequestType, response: ArrowExpress.InternalResponseType, context: RootContext) => ResponseObject | Promise<ResponseObject>;

export { }
