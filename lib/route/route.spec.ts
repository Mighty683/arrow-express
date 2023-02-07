import { Route } from "./route";
import Express from "express";

describe("Route", () => {
  const req = {} as Express.Request;
  const res = {} as Express.Response;
  describe("Request handle configuration", () => {
    it("should call handler", () => {
      const spy = jest.fn();
      Route().handler(spy).getRequestHandler()(req, res);
      expect(spy).toHaveBeenCalledWith(req, res);
    });
  });
});
