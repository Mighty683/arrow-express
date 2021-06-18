import Express from 'express';
import {AuthorizeGuard} from "./authorize.guard";

// This is example basic test of guard
// Guard, routes etc can be tested as pure functions
describe("Authorization Guard", () => {
  describe("token validation", () => {
    it("should reject request if token is not proper", () => {
      expect(AuthorizeGuard({
        headers: {
          authorization: 'Bearer not-proper-token'
        }
      } as Express.Request)).rejects.toThrow();
    });

    it("should authorize request if token is not proper", () => {
      expect(AuthorizeGuard({
        headers: {
          authorization: 'Bearer not-proper-token'
        }
      } as Express.Request)).resolves.toBe({
        userId: 1,
      });
    });
  })
});