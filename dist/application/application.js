"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.AppConfigurator = void 0;
var request_error_1 = require("../error/request.error");
var configuration_error_1 = require("../error/configuration.error");
var AppConfigurator = /** @class */ (function () {
    /**
     * Create AppConfigurator
     * @param expressApplication - express application
     * @param logRequests - flag if requests should be logged, true by default
     */
    function AppConfigurator(expressApplication, logRequests) {
        if (logRequests === void 0) { logRequests = true; }
        this._controllers = [];
        this._express = expressApplication;
        this._configured = false;
        this.logRequests = logRequests;
    }
    /**
     * Starts application, register controllers routes in express app
     * and connect to configured port.
     * @param printConfiguration - print express application routes enabled by default.
     */
    AppConfigurator.prototype.configure = function (printConfiguration) {
        if (printConfiguration === void 0) { printConfiguration = true; }
        if (this._configured) {
            throw new configuration_error_1.ConfigurationError("Cannot configure application multiple times");
        }
        else {
            this._configured = true;
        }
        this.startControllers();
        if (printConfiguration) {
            this.printExpressConfig();
        }
    };
    /**
     * Register controller in application.
     * @param controller - registered controller
     */
    AppConfigurator.prototype.registerController = function (controller) {
        this._controllers.push(controller);
        return this;
    };
    /**
     * Register list of controllers in application.
     * @param controllers - controllers to register
     */
    AppConfigurator.prototype.registerControllers = function () {
        var _this = this;
        var controllers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            controllers[_i] = arguments[_i];
        }
        controllers.forEach(function (controller) { return _this.registerController(controller); });
        return this;
    };
    // PRIVATE
    AppConfigurator.prototype.printExpressConfig = function () {
        console.log("Routes registered by Express server:");
        this.getExpressRoutesAsStrings().forEach(function (route) { return console.log(route); });
    };
    AppConfigurator.prototype.startControllers = function () {
        var _this = this;
        this._controllers.forEach(function (controller) { return _this.startController(controller); });
    };
    AppConfigurator.prototype.startController = function (controller, prefix) {
        var _this = this;
        if (prefix === void 0) { prefix = ""; }
        controller.getControllers().forEach(function (subController) {
            _this.startController(subController, AppConfigurator.getRoutePath(controller.getPrefix(), prefix));
        });
        controller.getRoutes().forEach(function (route) {
            _this.registerRouteInExpress(controller, route, prefix);
        });
    };
    AppConfigurator.prototype.registerRouteInExpress = function (controller, route, prefix) {
        var routePath = AppConfigurator.getRoutePath(prefix, controller.getPrefix(), route.getPath());
        if (!route.getMethod()) {
            throw new configuration_error_1.ConfigurationError("Route ".concat(routePath, " has no method specified"));
        }
        this._express[route.getMethod()]("/".concat(routePath), this.createApplicationRequestHandler(route.getRequestHandler()));
    };
    AppConfigurator.prototype.createApplicationRequestHandler = function (routeRequestHandler) {
        var _this = this;
        return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, routeRequestHandler(req, res)];
                    case 1:
                        response = _a.sent();
                        if (AppConfigurator.isResponseAlreadyEnded(res)) {
                            if (!res.statusCode) {
                                res.status(200);
                            }
                            res.send(response);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        if (AppConfigurator.isResponseAlreadyEnded(res)) {
                            if (error_1 instanceof request_error_1.RequestError) {
                                res
                                    .status(error_1.httpCode || 500)
                                    .send(error_1.response || "Internal error");
                            }
                            else {
                                res.status(500).send("Internal error");
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.logRequest(req, res);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    };
    AppConfigurator.prototype.logRequest = function (req, res) {
        if (this.logRequests) {
            console.log("Request ".concat(req.method, ":").concat(req.path, " Response status: ").concat(res.statusCode));
        }
    };
    AppConfigurator.prototype.getExpressRoutesAsStrings = function () {
        return this._express._router.stack
            .filter(function (r) { return r.route; })
            .map(AppConfigurator.expressRouteAsString);
    };
    // STATIC
    AppConfigurator.expressRouteAsString = function (r) {
        var _a;
        return "".concat(Object.keys(r.route.methods)[0].toUpperCase(), ":").concat((_a = r.route) === null || _a === void 0 ? void 0 : _a.path);
    };
    /**
     * Get final route path
     * @param paths - array of paths
     * @private
     */
    AppConfigurator.getRoutePath = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return paths.filter(function (path) { return !!path; }).join("/");
    };
    AppConfigurator.isResponseAlreadyEnded = function (res) {
        return !res.writableEnded;
    };
    return AppConfigurator;
}());
exports.AppConfigurator = AppConfigurator;
/**
 * Creates application core
 * @param options.app - Express application used by application
 * @param options.logRequests - log requests, enabled by default
 */
function Application(options) {
    return new AppConfigurator(options.app, options.logRequests);
}
exports.Application = Application;
