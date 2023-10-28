import Express from "express";
export type RouteHandler<C = undefined, R = undefined> = (request: Express.Request, response: Express.Response, context: C) => R | Promise<R>;
export type HttpMethod = "get" | "post" | "head" | "put" | "delete" | "options" | "patch";
export declare class RouteConfigurator<C = undefined, R = undefined> {
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
    handler(handler: RouteHandler<C, R>): this;
    getMethod(): string;
    getPath(): string;
    /**
     * Get request handler function
     * @return - function which is called by express application on request
     */
    getRequestHandler(): RouteHandler<C, R>;
}
export declare function Route<C = undefined, R = undefined>(): RouteConfigurator<C, R>;
