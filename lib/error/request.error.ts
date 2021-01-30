/**
 * Error type used by arrow-express to handle errors.
 */
export class RequestError extends Error {
    response?: Record<string, unknown>
    httpCode: number

    /**
   * RequestError constructor
   * @param httpCode - HTTP response code used by arrow-express default 500
   * @param response - response body send on error
   */
    constructor(httpCode?: number, response?: Record<string, unknown>) {
      super('Wrong api response');
      this.response = response;
      this.httpCode = httpCode || 500;
      /**
       * Workaround for error extending
       * https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
       */
      Object.setPrototypeOf(this, RequestError.prototype);
    }
}