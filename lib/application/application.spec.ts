import { Application } from './application';
import { Controller } from '../controller/controller';
import { Route } from '../route/route';
import Express from 'express';
import { ApiError } from '../error/apiErrorResponse';
import {mocked} from "ts-jest";

const ExpressAppStub: Express.Application = {
  use: jest.fn(),
  post: jest.fn(),
  get: jest.fn(),
  listen: jest.fn(),
} as unknown as Express.Application;


describe('Application', () => {
  afterEach(() => {
    mocked(ExpressAppStub.use).mockReset();
    mocked(ExpressAppStub.post).mockReset();
    mocked(ExpressAppStub.get).mockReset();
  });
  describe('route registration', () => {
    it('should register post route', () => {
      const handlerSpy = jest.fn();
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller()
            .prefix('prefix')
            .registerRoute(

              Route()
                .method('post')
                .path('path')
                .handler(handlerSpy)
            )
        ).start();
      expect(ExpressAppStub.post).toHaveBeenCalledWith('/prefix/path', expect.any(Function));
    });
    it('should register get route', () => {
      const handlerSpy = jest.fn();
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller().prefix('prefix')
            .registerRoute(
              Route()
                .method('get')
                .path('')
                .handler(handlerSpy)
            )
        ).start();
      expect(ExpressAppStub.get).toHaveBeenCalledWith('/prefix', expect.any(Function));
    });
  });
  describe('request handling', () => {
    let resSpy: Express.Response;
    beforeEach(() => {
      resSpy= {
        status: jest.fn().mockImplementation(() => resSpy),
        send: jest.fn().mockImplementation(() => resSpy),
        writableEnded: false,
      } as unknown as Express.Response;
    });
    it('should response 200', async () => {
      const spy = jest.fn();
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller()
            .registerRoute(
              Route()
                .method('get')
                .handler(spy)
            )
        ).start();
      await mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
      expect(resSpy.status).toHaveBeenCalledWith(200);
    });
    it('should not response 200', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (resSpy.writableEnded as boolean) = true;
      const spy = jest.fn();
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller()
            .registerRoute(
              Route()
                .method('get')
                .handler(spy)
            )
        ).start();
      await mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
      expect(resSpy.status).not.toHaveBeenCalled();
    });
    it('should response 500', async () => {
      const spy = jest.fn().mockRejectedValue(new Error());
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller()
            .registerRoute(
              Route()
                .method('get')
                .handler(spy)
            )
        ).start();
      await mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
      expect(resSpy.status).toHaveBeenCalledWith(500);
    });
    it('should response 404', async () => {
      const spy = jest.fn().mockRejectedValue(new ApiError(404));
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller()
            .registerRoute(
              Route()
                .method('get')
                .handler(spy)
            )
        ).start();
      await mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
      expect(resSpy.status).toHaveBeenCalledWith(404);
    });
    it('should send error response', async () => {
      const response = {
        code: 1,
        message: 'msg'
      };
      const spy = jest.fn().mockRejectedValue(new ApiError(401, response));
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller()
            .registerRoute(
              Route()
                .method('get')
                .handler(spy)
            )
        ).start();
      await mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
      expect(resSpy.send).toHaveBeenCalledWith(response);
      expect(resSpy.status).toHaveBeenCalledWith(500);
    });
    it('should not response', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (resSpy as never).writableEnded = true;
      const spy = jest.fn().mockRejectedValue(new Error());
      Application({port: 8080, app: ExpressAppStub})
        .registerController(
          Controller()
            .registerRoute(
              Route()
                .method('get')
                .handler(spy)
            )
        ).start();
      await mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
      expect(resSpy.status).not.toHaveBeenCalled();
    });
  });
});