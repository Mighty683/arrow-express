"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = void 0;
/**
 * Error type used by arrow-express to handle errors.
 */
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    /**
   * RequestError constructor
   * @param httpCode - HTTP response code used by arrow-express default 500
   * @param response - response body send on error
   */
    function RequestError(httpCode, response) {
        var _this = _super.call(this, 'Wrong api response') || this;
        _this.response = response;
        _this.httpCode = httpCode || 500;
        /**
         * Workaround for error extending
         * https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(_this, RequestError.prototype);
        return _this;
    }
    return RequestError;
}(Error));
exports.RequestError = RequestError;
