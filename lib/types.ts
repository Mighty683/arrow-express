export namespace ArrowExpress {
  export interface InternalRequestType {}
  export interface InternalResponseType {}
}

export type RouteConfiguration = {
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
  handler: (
    req: ArrowExpress.InternalRequestType,
    res: ArrowExpress.InternalResponseType,
    context: unknown
  ) => Promise<unknown>;
};
