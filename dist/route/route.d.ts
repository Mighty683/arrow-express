import Express from 'express';
export type RouteHandler<Context> = (request: Express.Request, response: Express.Response, context: Context) => unknown;
export type RequestHandler = (request: Express.Request, response: Express.Response) => unknown;
export type ContextGuard<Context> = (request: Express.Request, response: Express.Response) => Promise<Context> | Context | void;
export type HttpMethod = 'get' | 'post' | 'head' | 'put' | 'delete' | 'options' | 'patch';
export declare class RouteConfigurator<Context = unknown> {
    private _method;
    private _path;
    private _handler;
    private _contextGuard;
    /**
     * Set method for route
     * @param method - Method
     */
    method(method: HttpMethod): RouteConfigurator<Context>;
    /**
     * Register path of route alongside with prefix it is used to create full path
     * @param path
     */
    path(path: string): RouteConfigurator<Context>;
    /**
     * Used to add pre-checks or side operations for request if guard throw error, handler is not called
     * @param guard - ContextGuard returning context used by handler
     */
    contextGuard<NewContext>(guard: ContextGuard<NewContext>): RouteConfigurator<NewContext>;
    /**
     * Set request handler, here you can handle request
     * @param handler - RouteHandler
     */
    handler(handler: RouteHandler<Context>): RouteConfigurator<Context>;
    getMethod(): string;
    getPath(): string;
    /**
     * Get request handler function
     * @return - function which is called by express application on request
     */
    getRequestHandler(): RequestHandler;
}
export declare function Route<Context = void>(): RouteConfigurator<Context>;
