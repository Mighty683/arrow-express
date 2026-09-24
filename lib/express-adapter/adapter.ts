import type { Express, RequestHandler, Response, Request } from "express";
import { AppConfigurator } from "../application/application";
import { ConfigurationError } from "../error/configuration.error";
import { RouteConfiguration } from "../types";
import { RequestError } from "../error/request.error";

const SUPPORTED_HTTP_METHODS = new Set(["get", "post", "head", "put", "delete", "options", "patch"]);

export class ExpressAdapterConfiguration {
  private readonly _express: Express;
  private readonly _appConfigurator: AppConfigurator;
  private _configured: boolean;
  constructor(express: Express, appConfigurator: AppConfigurator) {
    this._configured = false;
    this._express = express;
    this._appConfigurator = appConfigurator;
  }

  private static expressRouteAsString(r: any) {
    return `${Object.keys(r.route.methods)[0].toUpperCase()}:${r.route?.path}`;
  }

  private validateRoute(routeConfiguration: RouteConfiguration) {
    if (
      typeof routeConfiguration.path !== "string" ||
      !SUPPORTED_HTTP_METHODS.has(routeConfiguration.method) ||
      typeof routeConfiguration.handler !== "function" ||
      typeof (this._express as unknown as Record<string, unknown>)[routeConfiguration.method] !== "function"
    ) {
      throw new ConfigurationError(
        `${routeConfiguration.path} route is not properly configured, missing or invalid path, method or handler`
      );
    }
  }

  private registerRouteInExpress(routeConfiguration: RouteConfiguration) {
    (this._express as any)[routeConfiguration.method](
      `/${routeConfiguration.path}`,
      this.createRequestHandler(routeConfiguration)
    );
  }

  private getExpressRoutesAsStrings() {
    return this._express.router.stack.filter((r: any) => r.route).map(ExpressAdapterConfiguration.expressRouteAsString);
  }

  private printExpressConfig() {
    console.log("Routes registered by Express server:");
    this.getExpressRoutesAsStrings().forEach((route: string) => console.log(route));
  }

  private static canSendResponse(res: Response) {
    return !res.headersSent && !res.writableEnded;
  }

  private createRequestHandler(routeConfiguration: RouteConfiguration): RequestHandler {
    return async (req: Request, res: Response, next) => {
      try {
        let context: unknown;

        const response = await routeConfiguration.handler(req, res, context);
        if (ExpressAdapterConfiguration.canSendResponse(res)) {
          if (!res.statusCode) {
            res.status(200);
          }
          res.send(response);
        }
      } catch (error) {
        if (error instanceof RequestError && ExpressAdapterConfiguration.canSendResponse(res)) {
          res.status(error.httpCode || 500).send(error.response || "Internal error");
          return;
        }

        next(error);
      }
    };
  }

  /**
   * Register controllers routes in express app
   * @param printConfiguration - print express application routes enabled by default.
   */
  configure(printConfiguration = true): void {
    if (this._configured) {
      throw new ConfigurationError("Cannot configure application multiple times");
    }
    const routesConfigurations = this._appConfigurator.buildRoutes();
    routesConfigurations.forEach(routeConfiguration => this.validateRoute(routeConfiguration));
    routesConfigurations.forEach(routeConfiguration => this.registerRouteInExpress(routeConfiguration));
    this._configured = true;
    if (printConfiguration) {
      this.printExpressConfig();
    }
  }
}

export const ExpressAdapter = (express: Express, appConfigurator: AppConfigurator): ExpressAdapterConfiguration => {
  return new ExpressAdapterConfiguration(express, appConfigurator);
};
