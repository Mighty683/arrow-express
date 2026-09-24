import express, { type NextFunction, type Request, type Response } from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { Application } from "../application/application";
import { Controller } from "../controller/controller";
import { ExpressAdapter } from "./adapter";
import { Route } from "../route/route";

const servers: Server[] = [];

async function startServer(app: ReturnType<typeof express>) {
  const server = app.listen(0);
  servers.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address() as AddressInfo;
  return { server, url: `http://127.0.0.1:${address.port}` };
}

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      server =>
        new Promise<void>(resolve => {
          server.close(() => resolve());
        })
    )
  );
});

describe("Express Adapter HTTP integration", () => {
  it("serves a route with the application and nested controller prefixes", async () => {
    const app = express();
    ExpressAdapter(
      app,
      Application()
        .prefix("api")
        .registerController(
          Controller()
            .prefix("root")
            .registerController(
              Controller()
                .prefix("child")
                .registerRoute(Route().method("get").path("status").handler(() => ({ ok: true })))
            )
        )
    ).configure(false);
    const { url } = await startServer(app);

    const response = await fetch(`${url}/api/root/child/status`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("forwards unexpected route errors to project error middleware", async () => {
    const app = express();
    ExpressAdapter(
      app,
      Application().registerController(
        Controller().registerRoute(Route().method("get").handler(() => Promise.reject(new Error("route failed"))))
      )
    ).configure(false);
    app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
      response.status(503).json({ error: error.message });
    });
    const { url } = await startServer(app);

    const response = await fetch(`${url}/`);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "route failed" });
  });

  it("does not send a second response after a handler starts streaming", async () => {
    const app = express();
    ExpressAdapter(
      app,
      Application().registerController(
        Controller().registerRoute(
          Route()
            .method("get")
            .handler((_request, response) => {
              const expressResponse = response as Response;
              expressResponse.status(202).write("first");
              setTimeout(() => expressResponse.end(" second"), 0);
              return { ignored: true };
            })
        )
      )
    ).configure(false);
    const { url } = await startServer(app);

    const response = await fetch(`${url}/`);

    expect(response.status).toBe(202);
    await expect(response.text()).resolves.toBe("first second");
  });
});
