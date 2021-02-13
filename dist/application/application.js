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
        while (_) try {
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
var AppConfigurator = /** @class */ (function () {
    function AppConfigurator(port, app) {
        this._controllers = [];
        this._express = app;
        this._started = false;
        this.port = port;
    }
    AppConfigurator.getRoutePath = function (prefix, path) {
        var prefixPath = prefix ? "/" + prefix : '/';
        var routePath = path ? "" + (prefix ? "/" + path : path) : '';
        return prefixPath + routePath;
    };
    AppConfigurator.prototype.registerRoute = function (controller, route) {
        var _this = this;
        this._express[route.getMethod()](AppConfigurator.getRoutePath(controller.getPrefix(), route.getPath()), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AppConfigurator.handleRequest(req, res, route.getRequestHandler())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AppConfigurator.handleRequest = function (req, res, requestHandler) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, requestHandler(req, res)];
                    case 1:
                        response = _a.sent();
                        if (!res.writableEnded) {
                            if (!res.statusCode) {
                                res.status(200);
                            }
                            res.send(response);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (!res.writableEnded) {
                            if (error_1 instanceof request_error_1.RequestError) {
                                res.status(error_1.httpCode || 500).send(error_1.response || 'Internal error');
                            }
                            res.status(500).send('Internal error');
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AppConfigurator.prototype.getExpressRoutesAsStrings = function () {
        return this._express._router.stack
            .filter(function (r) { return r.route; })
            .map(function (r) { var _a; return Object.keys(r.route.methods)[0].toUpperCase() + ":" + ((_a = r.route) === null || _a === void 0 ? void 0 : _a.path); });
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
     * Register controller in application.
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
    /**
     * Starts application, register controllers routes in express app
     * and connect to configured port
     */
    AppConfigurator.prototype.start = function () {
        var _this = this;
        if (this._started) {
            throw new Error('Cannot start application multiple times');
        }
        this._started = true;
        this._controllers.forEach(function (controller) {
            controller.getRoutes().forEach(function (route) {
                _this.registerRoute(controller, route);
            });
        });
        this._express.listen(this.port, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("App started on port " + this.port);
                console.log('Routes registered by Express server:');
                this.getExpressRoutesAsStrings().forEach(function (route) { return console.log(route); });
                return [2 /*return*/];
            });
        }); });
    };
    return AppConfigurator;
}());
exports.AppConfigurator = AppConfigurator;
/**
 * Creates application core
 * @param options.port - port used by application
 * @param options.app - Express application used by application
 */
function Application(options) {
    return new AppConfigurator(options.port, options.app);
}
exports.Application = Application;
