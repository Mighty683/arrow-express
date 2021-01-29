import Express from 'express';

export type RouteHandler<Context> = (request: Express.Request, response: Express.Response, context: Context) => unknown;
export type RequestHandler = (request: Express.Request, response: Express.Response) => unknown;
export type ContextGuard<Context> = (request: Express.Request, response: Express.Response) => Promise<Context> | Context | void;
export type HttpMethod = 'get' | 'post' | 'head' |'put' | 'delete' | 'options' | 'patch';

export class RouteConfigurator<Context = unknown> {
  private _method: HttpMethod
  private _path: string
  private _handler: RouteHandler<unknown>
  private _contextGuard: ContextGuard<unknown>

  /**
   * Set method for route
   * @param method - Method
   */
  method(method: HttpMethod): RouteConfigurator<Context> {
    this._method = method || 'get';
    return this;
  }
  /**
   * Register path of route alongside with prefix it is used to create full path
   * @param path 
   */
  path(path: string): RouteConfigurator<Context> {
    this._path = path;
    return this;
  }
  /**
   * Used to add pre-checks or side operations for request if guard throw error, handler is not called
   * @param guard - ContextGuard returning context used by handler
   */
  contextGuard<NewContext>(guard: ContextGuard<NewContext>): RouteConfigurator<NewContext> {
    this._contextGuard = guard;
    return this as unknown as RouteConfigurator<NewContext>;
  }
  /**
   * Set request handler, here you can handle request
   * @param handler - RouteHandler
   */
  handler(handler: RouteHandler<Context>): RouteConfigurator<Context> {
    this._handler = handler;
    return this;
  }
  getMethod(): string {
    return this._method;
  }
  getPath(): string {
    return this._path;
  }
  getRequestHandler(): RequestHandler {
    return async (request: Express.Request, response: Express.Response) => {
      return this._handler(request, response, this._contextGuard && await this._contextGuard(request, response));
    };
  }
}

export function Route<Context = void>(): RouteConfigurator<Context> {
  return new RouteConfigurator();
}