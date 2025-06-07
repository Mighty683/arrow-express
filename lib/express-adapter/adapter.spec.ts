import type { Express, Response, Request } from "express";
import { Application } from "../application/application";
import { vi } from "vitest";
import { Controller, ControllerHandler } from "../controller/controller";
import { Route } from "../route/route";
import { RequestError } from "../error/request.error";
import { ConfigurationError } from "../error/configuration.error";
import { ExpressAdapter } from "./adapter";

const ExpressAppStub: Express = {
  use: vi.fn(),
  post: vi.fn(),
  get: vi.fn(),
  _router: {
    stack: [],
  },
} as unknown as Express;

describe("Express Adapter", () => {
  afterEach(() => {
    vi.mocked(ExpressAppStub.use).mockReset();
    vi.mocked(ExpressAppStub.post).mockReset();
    vi.mocked(ExpressAppStub.get).mockReset();
  });
  describe("configure", () => {
    it("should throw error if app is configured multiple times", () => {
      const expressAdapter = ExpressAdapter(ExpressAppStub, Application());

      expressAdapter.configure(false);

      expect(expressAdapter.configure).toThrow();
    });
    describe("route registration", () => {
      it("should register post route", () => {
        const handlerSpy = vi.fn();
        const expressAdapter = ExpressAdapter(
          ExpressAppStub,
          Application().registerController(
            Controller().prefix("prefix").registerRoute(Route().method("post").path("path").handler(handlerSpy))
          )
        );
        expressAdapter.configure(false);
        expect(ExpressAppStub.post).toHaveBeenCalledWith("/prefix/path", expect.any(Function));
      });
      it("should register get route", () => {
        const handlerSpy = vi.fn();
        const expressAdapter = ExpressAdapter(
          ExpressAppStub,
          Application().registerController(
            Controller().prefix("prefix").registerRoute(Route().method("get").path("").handler(handlerSpy))
          )
        );
        expressAdapter.configure(false);
        expect(ExpressAppStub.get).toHaveBeenCalledWith("/prefix", expect.any(Function));
      });
      it("should register route without path", () => {
        const handlerSpy = vi.fn();

        const expressAdapter = ExpressAdapter(
          ExpressAppStub,
          Application().registerController(
            Controller().prefix("prefix").registerRoute(Route().method("get").handler(handlerSpy))
          )
        );
        expressAdapter.configure(false);
        expect(ExpressAppStub.get).toHaveBeenCalledWith("/prefix", expect.any(Function));
      });

      it("should register route with application prefix", () => {
        const handlerSpy = vi.fn();

        const expressAdapter = ExpressAdapter(
          ExpressAppStub,
          Application()
            .prefix("app-prefix")
            .registerController(Controller().prefix("prefix").registerRoute(Route().method("get").handler(handlerSpy)))
        );
        expressAdapter.configure(false);
        expect(ExpressAppStub.get).toHaveBeenCalledWith("/app-prefix/prefix", expect.any(Function));
      });

      it("should register route without path and prefix", () => {
        const handlerSpy = vi.fn();

        const expressAdapter = ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(handlerSpy)))
        );
        expressAdapter.configure(false);
        expect(ExpressAppStub.get).toHaveBeenCalledWith("/", expect.any(Function));
      });

      it("should throw configuration error when route without method is registered", () => {
        const handlerSpy = vi.fn();
        expect(() =>
          ExpressAdapter(
            ExpressAppStub,
            Application().registerController(
              Controller().prefix("prefix").registerRoute(Route().path("").handler(handlerSpy))
            )
          ).configure(false)
        ).toThrow(ConfigurationError);
      });
      describe("sub controllers", () => {
        it("should register sub controller route", () => {
          const handlerSpy = vi.fn();
          const expressAdapter = ExpressAdapter(
            ExpressAppStub,
            Application().registerController(
              Controller()
                .prefix("root")
                .registerRoute(Route().path("path").method("get").handler(handlerSpy))
                .registerController(Controller().prefix("sub").registerRoute(Route().method("get").handler(handlerSpy)))
            )
          );
          expressAdapter.configure(false);
          expect(ExpressAppStub.get).toHaveBeenCalledWith("/root/sub", expect.any(Function));
          expect(ExpressAppStub.get).toHaveBeenCalledWith("/root/path", expect.any(Function));
        });
      });
    });
    describe("request handling", () => {
      let resSpy: Response;
      beforeEach(() => {
        resSpy = {
          status: vi.fn().mockImplementation(() => resSpy),
          send: vi.fn().mockImplementation(() => resSpy),
          writableEnded: false,
        } as unknown as Response;
      });
      it("should response 200", async () => {
        const spy = vi.fn();
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
        ).configure(false);

        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);

        expect(resSpy.status).toHaveBeenCalledWith(200);
      });

      it("should not override statusCode", async () => {
        const spy = vi.fn();
        resSpy.statusCode = 301;
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(resSpy.status).not.toHaveBeenCalledWith(200);
      });

      it("should not response 200 when res is not writable", async () => {
        (resSpy.writableEnded as boolean) = true;
        const spy = vi.fn();
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(resSpy.status).not.toHaveBeenCalled();
      });

      describe("error handling", () => {
        it("should response code 500 by default", async () => {
          const resSpy = {
            status: vi.fn().mockImplementation(() => resSpy),
            send: vi.fn().mockImplementation(() => resSpy),
            writableEnded: false,
          } as unknown as Response;

          const spy = vi.fn().mockRejectedValue(new Error());
          ExpressAdapter(
            ExpressAppStub,
            Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
          ).configure(false);
          await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
          expect(resSpy.status).toHaveBeenCalledWith(500);
        });
      });
      it("should response code 500 on non RequestError", async () => {
        const resSpy = {
          status: vi.fn().mockImplementation(() => resSpy),
          send: vi.fn().mockImplementation(() => resSpy),
          writableEnded: false,
        } as unknown as Response;

        const spy = vi.fn().mockRejectedValue(new Error());
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(resSpy.status).toHaveBeenCalledWith(500);
      });
      it("should response 404", async () => {
        const resSpy = {
          status: vi.fn().mockImplementation(() => resSpy),
          send: vi.fn().mockImplementation(() => resSpy),
          writableEnded: false,
        } as unknown as Response;

        const spy = vi.fn().mockRejectedValue(new RequestError(404));
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(resSpy.status).toHaveBeenCalledWith(404);
      });

      it("should send error response", async () => {
        const response = {
          code: 1,
          message: "msg",
        };
        const spy = vi.fn().mockRejectedValue(new RequestError(401, response));
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(resSpy.send).toHaveBeenCalledWith(response);
        expect(resSpy.status).toHaveBeenCalledWith(401);
      });
      it("should not response", async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (resSpy.writableEnded as boolean) = true;
        const spy = vi.fn().mockRejectedValue(new Error());
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().registerRoute(Route().method("get").handler(spy)))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(resSpy.status).not.toHaveBeenCalled();
      });
      it("should pass context from controller handler to route handler", async () => {
        const spy = vi.fn().mockResolvedValue("context") as ControllerHandler<any>;
        const routeSpy = vi.fn();
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(
            Controller().handler(spy).registerRoute(Route().method("get").handler(routeSpy))
          )
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(routeSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), "context");
      });
      it("should pass context from root controller to route handler", async () => {
        const spy = vi.fn().mockResolvedValue("context") as ControllerHandler<any>;
        const routeSpy = vi.fn();
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(
            Controller()
              .handler(spy)
              .registerController(Controller().registerRoute(Route().method("get").handler(routeSpy)))
          )
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(routeSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), "context");
      });
      it("should pass context through controllers chain", async () => {
        const rootSpy = vi.fn().mockResolvedValue("root-context") as ControllerHandler<any>;
        const spy = vi
          .fn()
          .mockImplementation((_, __, context) => context + "-child-context") as ControllerHandler<any>;
        const routeSpy = vi.fn();
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(
            Controller()
              .handler(rootSpy)
              .registerController(Controller().handler(spy).registerRoute(Route().method("get").handler(routeSpy)))
          )
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(routeSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), "root-context-child-context");
      });

      it("should pass context through controllers chain if child controllers doesn't have context", async () => {
        const rootSpy = vi.fn().mockResolvedValue("root-context") as ControllerHandler<any>;
        const routeSpy = vi.fn();
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(
            Controller()
              .handler(rootSpy)
              .registerController(Controller().registerRoute(Route().method("get").handler(routeSpy)))
          )
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(routeSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), "root-context");
      });
      it("should call controller handler", async () => {
        const spy = vi.fn().mockResolvedValue("context") as ControllerHandler<any>;
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().handler(spy).registerRoute(Route().method("get")))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(spy).toHaveBeenCalled();
      });
      it("should send error response from controller handler", async () => {
        const response = {
          code: 1,
          message: "msg",
        };
        const spy = vi.fn().mockRejectedValue(new RequestError(401, response)) as ControllerHandler<any>;
        ExpressAdapter(
          ExpressAppStub,
          Application().registerController(Controller().handler(spy).registerRoute(Route().method("get")))
        ).configure(false);
        await vi.mocked(ExpressAppStub.get).mock.calls[0][1]({} as never, resSpy);
        expect(resSpy.send).toHaveBeenCalledWith(response);
        expect(resSpy.status).toHaveBeenCalledWith(401);
      });
    });
  });
});
