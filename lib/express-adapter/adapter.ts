import type { Express, RequestHandler, Response, Request } from "express";
import { AppConfigurator } from "../application/application";
import { ConfigurationError } from "../error/configuration.error";
import { RouteConfiguration } from "../types";
import { RequestError } from "../error/request.error";

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

  private registerRouteInExpress(routeConfiguration: RouteConfiguration) {
    if (!routeConfiguration.method || !routeConfiguration.handler) {
      throw new ConfigurationError(
        `${routeConfiguration.path} route is not properly configured, missing path, method or handler`
      );
    }
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
    return !res.writableEnded;
  }

  private createRequestHandler(routeConfiguration: RouteConfiguration): RequestHandler {
    return async (req: Request, res: Response) => {
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
        if (ExpressAdapterConfiguration.canSendResponse(res)) {
          if (error instanceof RequestError) {
            res.status(error.httpCode || 500).send(error.response || "Internal error");
          } else {
            res.status(500).send("Internal error");
          }
        }
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
    } else {
      this._configured = true;
    }
    const routesConfigurations = this._appConfigurator.buildRoutes();
    routesConfigurations.forEach(routeConfiguration => this.registerRouteInExpress(routeConfiguration));
    if (printConfiguration) {
      this.printExpressConfig();
    }
  }
}

export const ExpressAdapter = (express: Express, appConfigurator: AppConfigurator): ExpressAdapterConfiguration => {
  return new ExpressAdapterConfiguration(express, appConfigurator);
};
