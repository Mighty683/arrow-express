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
