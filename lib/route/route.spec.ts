import { Route } from './route';
import Express from 'express';

describe('Route', () => {
  const req = {} as Express.Request;
  const res = {} as Express.Response;
  describe('Request handle configuration', () => {
    it('should call handler', () => {
      const spy = jest.fn();
      Route()
        .handler(spy)
        .getRequestHandler()(req, res);
      expect(spy).toHaveBeenCalledWith(req, res, undefined);
    });
    it('should call handler with context', async () => {
      const spy = jest.fn();
      const context = jest.fn();
      const contextGuardSpy = jest.fn().mockReturnValue(context);
      await Route()
        .handler(spy)
        .contextGuard(contextGuardSpy)
        .getRequestHandler()(req, res);
      expect(spy).toHaveBeenCalledWith(req, res, context);
    });
  });
});