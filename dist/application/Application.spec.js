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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Application_1 = require("./Application");
var Controller_1 = require("../controller/Controller");
var Route_1 = require("../route/Route");
var express_1 = __importDefault(require("express"));
var apiErrorResponse_1 = require("../error/apiErrorResponse");
var ts_jest_1 = require("ts-jest");
var ExpressAppStub = {
    use: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    listen: jest.fn(),
};
jest.mock('express', function () { return jest.fn(); });
describe('Application', function () {
    beforeAll(function () {
        ts_jest_1.mocked(express_1.default).mockReturnValue(ExpressAppStub);
    });
    afterEach(function () {
        ExpressAppStub.use.mockReset();
        ExpressAppStub.post.mockReset();
        ExpressAppStub.get.mockReset();
    });
    describe('route registration', function () {
        it('should register post route', function () {
            var handlerSpy = jest.fn();
            Application_1.Application({ port: 8080 })
                .registerController(Controller_1.Controller()
                .prefix('prefix')
                .registerRoute(Route_1.Route()
                .method('post')
                .path('path')
                .handler(handlerSpy))).start();
            expect(ExpressAppStub.post).toHaveBeenCalledWith('/prefix/path', expect.any(Function));
        });
        it('should register get route', function () {
            var handlerSpy = jest.fn();
            Application_1.Application({ port: 8080 })
                .registerController(Controller_1.Controller().prefix('prefix')
                .registerRoute(Route_1.Route()
                .method('get')
                .path('')
                .handler(handlerSpy))).start();
            expect(ExpressAppStub.get).toHaveBeenCalledWith('/prefix', expect.any(Function));
        });
    });
    describe('request handling', function () {
        var resSpy;
        beforeEach(function () {
            resSpy = {
                status: jest.fn().mockImplementation(function () { return resSpy; }),
                send: jest.fn().mockImplementation(function () { return resSpy; }),
                writableEnded: false,
            };
        });
        it('should response 200', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.fn();
                        Application_1.Application({ port: 8080 })
                            .registerController(Controller_1.Controller()
                            .registerRoute(Route_1.Route()
                            .method('get')
                            .handler(spy))).start();
                        return [4 /*yield*/, ExpressAppStub.get.mock.calls[0][1]({}, resSpy)];
                    case 1:
                        _a.sent();
                        expect(resSpy.status).toHaveBeenCalledWith(200);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not response 200', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        resSpy.writableEnded = true;
                        spy = jest.fn();
                        Application_1.Application({ port: 8080 })
                            .registerController(Controller_1.Controller()
                            .registerRoute(Route_1.Route()
                            .method('get')
                            .handler(spy))).start();
                        return [4 /*yield*/, ExpressAppStub.get.mock.calls[0][1]({}, resSpy)];
                    case 1:
                        _a.sent();
                        expect(resSpy.status).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should response 500', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.fn().mockRejectedValue(new Error());
                        Application_1.Application({ port: 8080 })
                            .registerController(Controller_1.Controller()
                            .registerRoute(Route_1.Route()
                            .method('get')
                            .handler(spy))).start();
                        return [4 /*yield*/, ExpressAppStub.get.mock.calls[0][1]({}, resSpy)];
                    case 1:
                        _a.sent();
                        expect(resSpy.status).toHaveBeenCalledWith(500);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should response 404', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.fn().mockRejectedValue(new apiErrorResponse_1.ApiError(404));
                        Application_1.Application({ port: 8080 })
                            .registerController(Controller_1.Controller()
                            .registerRoute(Route_1.Route()
                            .method('get')
                            .handler(spy))).start();
                        return [4 /*yield*/, ExpressAppStub.get.mock.calls[0][1]({}, resSpy)];
                    case 1:
                        _a.sent();
                        expect(resSpy.status).toHaveBeenCalledWith(404);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should send error response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            code: 1,
                            message: 'msg'
                        };
                        spy = jest.fn().mockRejectedValue(new apiErrorResponse_1.ApiError(401, response));
                        Application_1.Application({ port: 8080 })
                            .registerController(Controller_1.Controller()
                            .registerRoute(Route_1.Route()
                            .method('get')
                            .handler(spy))).start();
                        return [4 /*yield*/, ExpressAppStub.get.mock.calls[0][1]({}, resSpy)];
                    case 1:
                        _a.sent();
                        expect(resSpy.send).toHaveBeenCalledWith(response);
                        expect(resSpy.status).toHaveBeenCalledWith(500);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        resSpy.writableEnded = true;
                        spy = jest.fn().mockRejectedValue(new Error());
                        Application_1.Application({ port: 8080 })
                            .registerController(Controller_1.Controller()
                            .registerRoute(Route_1.Route()
                            .method('get')
                            .handler(spy))).start();
                        return [4 /*yield*/, ExpressAppStub.get.mock.calls[0][1]({}, resSpy)];
                    case 1:
                        _a.sent();
                        expect(resSpy.status).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
