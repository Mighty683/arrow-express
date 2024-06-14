import Express from "express";
export type RouteHandler<RootContext = unknown, Response = unknown> = (request: Express.Request, response: Express.Response, context: RootContext) => Response | Promise<Response>;
export type HttpMethod = "get" | "post" | "head" | "put" | "delete" | "options" | "patch";
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
export declare function Route<C = unknown, R = unknown>(): RouteConfigurator<C, R>;
