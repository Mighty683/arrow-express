"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.ControllerConfiguration = void 0;
var ControllerConfiguration = /** @class */ (function () {
    function ControllerConfiguration() {
        this._routes = [];
    }
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    ControllerConfiguration.prototype.registerRoute = function (route) {
        this._routes.push(route);
        return this;
    };
    /**
     * Register array of _routes in controller
     * @param _routes - _routes used in controller
     */
    ControllerConfiguration.prototype.registerRoutes = function () {
        var _this = this;
        var routes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            routes[_i] = arguments[_i];
        }
        routes.forEach(function (route) { return _this.registerRoute(route); });
        return this;
    };
    /**
     * Register controller prefix which will be used by all _routes
     * @param prefix - eg: 'login'
     */
    ControllerConfiguration.prototype.prefix = function (prefix) {
        this._prefix = prefix;
        return this;
    };
    ControllerConfiguration.prototype.getPrefix = function () {
        return this._prefix;
    };
    ControllerConfiguration.prototype.getRoutes = function () {
        return this._routes;
    };
    return ControllerConfiguration;
}());
exports.ControllerConfiguration = ControllerConfiguration;
function Controller() {
    return new ControllerConfiguration();
}
exports.Controller = Controller;
