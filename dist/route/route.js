"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteConfigurator = void 0;
exports.Route = Route;
var RouteConfigurator = /** @class */ (function () {
    function RouteConfigurator() {
    }
    /**
     * Set method for route
     * @param method - Method
     */
    RouteConfigurator.prototype.method = function (method) {
        this._method = method || "get";
        return this;
    };
    /**
     * Register path of route alongside with prefix it is used to create full path
     * @param path
     */
    RouteConfigurator.prototype.path = function (path) {
        this._path = path;
        return this;
    };
    /**
     * Set request handler, here you can handle request
     * @param handler - RouteHandler
     */
    RouteConfigurator.prototype.handler = function (handler) {
        this._handler = handler;
        return this;
    };
    RouteConfigurator.prototype.getMethod = function () {
        return this._method;
    };
    RouteConfigurator.prototype.getPath = function () {
        return this._path;
    };
    /**
     * Get request handler function
     * @return - function which is called by express application on request
     */
    RouteConfigurator.prototype.getRequestHandler = function () {
        return this._handler;
    };
    return RouteConfigurator;
}());
exports.RouteConfigurator = RouteConfigurator;
function Route() {
    return new RouteConfigurator();
}
