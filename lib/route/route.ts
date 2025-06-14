import { ArrowExpress } from "../types";

export type RouteHandler<RootContext = unknown, ResponseObject = unknown> = (
  request: ArrowExpress.InternalRequestType,
  response: ArrowExpress.InternalResponseType,
  context: RootContext
) => ResponseObject | Promise<ResponseObject>;
export type HttpMethod = "get" | "post" | "head" | "put" | "delete" | "options" | "patch";

export class RouteConfigurator<RootContext = unknown, Response = unknown> {
  private _method!: HttpMethod;
  private _path!: string;
  private _handler!: RouteHandler<RootContext, Response>;

  /**
   * Set method for route
   * @param method - Method
   */
  method(method: HttpMethod): this {
    this._method = method || "get";
    return this;
  }
  /**
   * Register path of route alongside with prefix it is used to create full path
   * @param path
   */

  path(path: string): this {
    this._path = path;
    return this;
  }

  /**
   * Set request handler, here you can handle request
   * @param handler - RouteHandler
   */
  handler(handler: RouteHandler<RootContext, Response>): this {
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
  getRequestHandler(): RouteHandler<RootContext, Response> {
    return this._handler;
  }
}

export function Route<C = unknown, R = unknown>(): RouteConfigurator<C, R> {
  return new RouteConfigurator<C, R>();
}
