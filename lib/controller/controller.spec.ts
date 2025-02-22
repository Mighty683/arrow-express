import { Route } from "../route/route";
import { Controller } from "./controller";

describe("controller", () => {
  describe("route registration", () => {
    it("should register single route", () => {
      //given
      const testRoute = Route();
      const testController = Controller();
      //when
      testController.registerRoute(testRoute);
      //then
      expect(testController.getRoutes()).toContain(testRoute);
    });
    it("should register multiple routes", () => {
      //given
      const testRoute = Route();
      const testRoute1 = Route();
      const testController = Controller();
      //when
      testController.registerRoutes(testRoute, testRoute1);
      //then
      expect(testController.getRoutes()).toContain(testRoute);
      expect(testController.getRoutes()).toContain(testRoute1);
    });
  });
});
