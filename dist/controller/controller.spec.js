"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var route_1 = require("../route/route");
var controller_1 = require("./controller");
describe('controller', function () {
    describe('route registration', function () {
        it('should register single route', function () {
            //given
            var testRoute = route_1.Route();
            var testController = controller_1.Controller();
            //when
            testController.registerRoute(testRoute);
            //then
            expect(testController.getRoutes()).toContain(testRoute);
        });
        describe('should register multiple routes', function () {
            //given
            var testRoute = route_1.Route();
            var testRoute1 = route_1.Route();
            var testController = controller_1.Controller();
            //when
            testController.registerRoutes(testRoute, testRoute1);
            //then
            expect(testController.getRoutes()).toContain(testRoute);
            expect(testController.getRoutes()).toContain(testRoute1);
        });
    });
});
