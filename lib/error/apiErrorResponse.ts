

export class ApiError extends Error {
    response?: unknown
    httpCode: number
    constructor(httpCode?: number, response?: unknown) {
      super('Wrong api response');
      this.response = response;
      this.httpCode = httpCode || 500;
      /**
         * Workaround for error extending
         * https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
      Object.setPrototypeOf(this, ApiError.prototype);
    }
}