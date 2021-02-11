import { Application } from './application';
import { Controller } from '../controller/controller';
import { Route } from '../route/route';
import Express from 'express';
import { RequestError } from '../error/request.error';
import {mocked} from "ts-jest/utils";

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
  describe('start', () => {
    it('should throw error if app is started multiple times', () => {
      const testApplication = Application({port: 8080, app: ExpressAppStub});

      testApplication.start();

      expect(testApplication.start). toThrow();
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
    it('should not override statusCode', async () => {
      const spy = jest.fn();
      resSpy.statusCode = 301;
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
      expect(resSpy.status).not.toHaveBeenCalledWith(200);
    });
    it('should not response 200 when res is not writable', async () => {
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

    describe('error handling', () => {
      it('should response code 500 by default', async () => {
        const spy = jest.fn().mockRejectedValue(new RequestError());
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
      it('should response code 500 on non RequestError', async () => {
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
        const spy = jest.fn().mockRejectedValue(new RequestError(404));
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
        const spy = jest.fn().mockRejectedValue(new RequestError(401, response));
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
        (resSpy.writableEnded as boolean) = true;
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
});