import { Route } from "./route";

describe("Route", () => {
  const req = {};
  const res = {};
  describe("Request handle configuration", () => {
    it("should call handler", () => {
      const spy = vi.fn();
      Route().handler(spy).getRequestHandler()(req, res, undefined);
      expect(spy).toHaveBeenCalledWith(req, res, undefined);
    });
  });
});
