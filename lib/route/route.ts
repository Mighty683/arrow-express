import Express from "express";

export type RouteHandler = (request: Express.Request, response: Express.Response) => unknown;
export type RequestHandler = (request: Express.Request, response: Express.Response) => unknown;
export type HttpMethod = "get" | "post" | "head" | "put" | "delete" | "options" | "patch";

export class RouteConfigurator {
  private _method: HttpMethod;
  private _path: string;
  private _handler: RouteHandler;

  /**
   * Set method for route
   * @param method - Method
   */
  method(method: HttpMethod): RouteConfigurator {
    this._method = method || "get";
    return this;
  }
  /**
   * Register path of route alongside with prefix it is used to create full path
   * @param path
   */

  path(path: string): RouteConfigurator {
    this._path = path;
    return this;
  }

  /**
   * Set request handler, here you can handle request
   * @param handler - RouteHandler
   */
  handler(handler: RouteHandler): RouteConfigurator {
    this._handler = handler;
    return this;
  }

  getMethod(): string {
    return this._method;
  }

  getPath(): string {
    return this._path;
  }

  /**
   * Get request handler function
   * @return - function which is called by express application on request
   */
  getRequestHandler(): RequestHandler {
    return async (request: Express.Request, response: Express.Response) => {
      return this._handler(request, response);
    };
  }
}

export function Route(): RouteConfigurator {
  return new RouteConfigurator();
}
