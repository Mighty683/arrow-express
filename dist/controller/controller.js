"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerConfiguration = void 0;
exports.Controller = Controller;
var ControllerConfiguration = /** @class */ (function () {
    function ControllerConfiguration() {
        this._prefix = "";
        this._controllers = [];
        this._routes = [];
    }
    /**
     * Register child controller in controller
     * @param controller - controller to register
     */
    ControllerConfiguration.prototype.registerController = function (controller) {
        this._controllers.push(controller);
        return this;
    };
    /**
     * Register array of controllers in controller
     * @param controllers - routes used in controller
     */
    ControllerConfiguration.prototype.registerControllers = function () {
        var controllers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            controllers[_i] = arguments[_i];
        }
        controllers.forEach(this.registerController.bind(this));
        return this;
    };
    /**
     * Register route in controller
     * @param route - route used in controller
     */
    ControllerConfiguration.prototype.registerRoute = function (route) {
        this._routes.push(route);
        return this;
    };
    /**
     * Register array of routes in controller
     * @param routes - routes used in controller
     */
    ControllerConfiguration.prototype.registerRoutes = function () {
        var routes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            routes[_i] = arguments[_i];
        }
        routes.forEach(this.registerRoute.bind(this));
        return this;
    };
    /**
     * Register controller prefix which will be used by all routes
     * @param prefix - eg: 'login'
     */
    ControllerConfiguration.prototype.prefix = function (prefix) {
        this._prefix = prefix;
        return this;
    };
    /**
     * Register controller handler which will be used by all routes
     * @param handler - ControllerHandler function
     */
    ControllerConfiguration.prototype.handler = function (handler) {
        this._handler = handler;
        return this;
    };
    ControllerConfiguration.prototype.getPrefix = function () {
        return this._prefix;
    };
    ControllerConfiguration.prototype.getRoutes = function () {
        return this._routes;
    };
    ControllerConfiguration.prototype.getControllers = function () {
        return this._controllers;
    };
    ControllerConfiguration.prototype.getHandler = function () {
        return this._handler;
    };
    return ControllerConfiguration;
}());
exports.ControllerConfiguration = ControllerConfiguration;
function Controller() {
    return new ControllerConfiguration();
}
