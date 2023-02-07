import Express from "express";
export type RouteHandler = (request: Express.Request, response: Express.Response) => unknown;
export type RequestHandler = (request: Express.Request, response: Express.Response) => unknown;
export type HttpMethod = "get" | "post" | "head" | "put" | "delete" | "options" | "patch";
export declare class RouteConfigurator {
    private _method;
    private _path;
    private _handler;
    /**
     * Set method for route
     * @param method - Method
     */
    method(method: HttpMethod): RouteConfigurator;
    /**
     * Register path of route alongside with prefix it is used to create full path
     * @param path
     */
    path(path: string): RouteConfigurator;
    /**
     * Set request handler, here you can handle request
     * @param handler - RouteHandler
     */
    handler(handler: RouteHandler): RouteConfigurator;
    getMethod(): string;
    getPath(): string;
    /**
     * Get request handler function
     * @return - function which is called by express application on request
     */
    getRequestHandler(): RequestHandler;
}
export declare function Route(): RouteConfigurator;
