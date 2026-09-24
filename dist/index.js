class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
class AppConfigurator {
  _prefix = "";
  _controllers = [];
  logRequests;
  /**
   * Create AppConfigurator
   * @param expressApplication - express application
   * @param logRequests - flag if requests should be logged, true by default
   */
  constructor(logRequests = true) {
    this.logRequests = logRequests;
  }
  /**
   * Register prefix for all paths in application
   * @param prefix - prefix string eg: 'api'
   */
  prefix(prefix) {
    this._prefix = prefix;
    return this;
  }
  getPrefix() {
    return this._prefix;
  }
  /**
   * Register controller in application.
   * @param controller - registered controller
   */
  registerController(controller) {
    this._controllers.push(controller);
    return this;
  }
  /**
   * Register list of controllers in application.
   * @param controllers - controllers to register
   */
  registerControllers(...controllers) {
    controllers.forEach((controller) => this.registerController(controller));
    return this;
  }
  getControllers() {
    return this._controllers;
  }
  /**
   * @description
   * Build routes from registered controllers.
   * It will create route configuration for each controller and its sub-controllers.
   * The route configuration will include the path, method, and handler for each route.
   * The handler will call the controller's handler and then the route's request handler.
   * If the controller has sub-controllers, it will recursively build routes for them as well.
   * @returns Array of route configurations built from registered controllers.
   */
  buildRoutes() {
    return this._controllers.reduce(
      (routes, controller) => routes.concat(this.reduceController(controller, this._prefix)),
      []
    );
  }
  reduceController(controller, path, handler) {
    const controllerPath = AppConfigurator.getRoutePath(path || "", controller.getPrefix());
    return controller.getRoutes().map((route) => {
      const routePath = AppConfigurator.getRoutePath(controllerPath, route.getPath());
      const requestHandler = route.getRequestHandler();
      if (!route.getMethod() || typeof requestHandler !== "function") {
        throw new ConfigurationError(`Route /${routePath} must define an HTTP method and handler`);
      }
      const routeConfiguration = {
        path: routePath,
        method: route.getMethod(),
        handler: async (request, response, context) => {
          const currentContext = await handler?.(request, response, context) || context;
          const controllerContext = await controller.getHandler()?.(request, response, currentContext);
          return requestHandler(request, response, controllerContext || currentContext);
        }
      };
      return routeConfiguration;
    }).concat(
      controller.getControllers().reduce((subRoutes, subController) => {
        return subRoutes.concat(
          this.reduceController(subController, controllerPath, async (request, response, context) => {
            const currentContext = await handler?.(request, response, context) || context;
            return controller.getHandler()?.(request, response, currentContext);
          })
        );
      }, [])
    );
  }
  /**
   * Get final route path
   * @param paths - array of paths
   * @private
   */
  static getRoutePath(...paths) {
    return paths.filter((path) => !!path).join(`/`);
  }
}
function Application() {
  return new AppConfigurator();
}
class ControllerConfiguration {
  _prefix = "";
  _controllers = [];
  _routes = [];
  _handler;
  /**
   * Register child controller in controller
   * @param controller - controller to register
   */
  registerController(controller) {
    this._controllers.push(controller);
    return this;
  }
  /**
   * Register array of controllers in controller
   * @param controllers - routes used in controller
   */
  registerControllers(...controllers) {
    controllers.forEach(this.registerController.bind(this));
    return this;
  }
  /**
   * Register route in controller
   * @param route - route used in controller
   */
  registerRoute(route) {
    this._routes.push(route);
    return this;
  }
  /**
   * Register array of routes in controller
   * @param routes - routes used in controller
   */
  registerRoutes(...routes) {
    routes.forEach(this.registerRoute.bind(this));
    return this;
  }
  /**
   * Register controller prefix which will be used by all routes
   * @param prefix - eg: 'login'
   */
  prefix(prefix) {
    this._prefix = prefix;
    return this;
  }
  /**
   * Register controller handler which will be used by all routes
   * @param handler - ControllerHandler function
   */
  handler(handler) {
    this._handler = handler;
    return this;
  }
  getPrefix() {
    return this._prefix;
  }
  getRoutes() {
    return this._routes;
  }
  getControllers() {
    return this._controllers;
  }
  getHandler() {
    return this._handler;
  }
}
function Controller() {
  return new ControllerConfiguration();
}
class RouteConfigurator {
  _method;
  _path;
  _handler;
  /**
   * Set method for route
   * @param method - Method
   */
  method(method) {
    this._method = method || "get";
    return this;
  }
  /**
   * Register path of route alongside with prefix it is used to create full path
   * @param path
   */
  path(path) {
    this._path = path;
    return this;
  }
  /**
   * Set request handler, here you can handle request
   * @param handler - RouteHandler
   */
  handler(handler) {
    this._handler = handler;
    return this;
  }
  getMethod() {
    return this._method;
  }
  getPath() {
    return this._path;
  }
  /**
   * Get request handler function
   * @return - function which is called by express application on request
   */
  getRequestHandler() {
    return this._handler;
  }
}
function Route() {
  return new RouteConfigurator();
}
class RequestError extends Error {
  response;
  httpCode;
  /**
  * RequestError constructor
  * @param httpCode - HTTP response code used by arrow-express default 500
  * @param response - response body send on error
  */
  constructor(httpCode, response) {
    super("Wrong api response");
    this.response = response;
    this.httpCode = httpCode || 500;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}
const SUPPORTED_HTTP_METHODS = /* @__PURE__ */ new Set(["get", "post", "head", "put", "delete", "options", "patch"]);
class ExpressAdapterConfiguration {
  _express;
  _appConfigurator;
  _configured;
  constructor(express, appConfigurator) {
    this._configured = false;
    this._express = express;
    this._appConfigurator = appConfigurator;
  }
  static expressRouteAsString(r) {
    return `${Object.keys(r.route.methods)[0].toUpperCase()}:${r.route?.path}`;
  }
  validateRoute(routeConfiguration) {
    if (typeof routeConfiguration.path !== "string" || !SUPPORTED_HTTP_METHODS.has(routeConfiguration.method) || typeof routeConfiguration.handler !== "function" || typeof this._express[routeConfiguration.method] !== "function") {
      throw new ConfigurationError(
        `${routeConfiguration.path} route is not properly configured, missing or invalid path, method or handler`
      );
    }
  }
  registerRouteInExpress(routeConfiguration) {
    this._express[routeConfiguration.method](
      `/${routeConfiguration.path}`,
      this.createRequestHandler(routeConfiguration)
    );
  }
  getExpressRoutesAsStrings() {
    return this._express.router.stack.filter((r) => r.route).map(ExpressAdapterConfiguration.expressRouteAsString);
  }
  printExpressConfig() {
    console.log("Routes registered by Express server:");
    this.getExpressRoutesAsStrings().forEach((route) => console.log(route));
  }
  static canSendResponse(res) {
    return !res.headersSent && !res.writableEnded;
  }
  createRequestHandler(routeConfiguration) {
    return async (req, res, next) => {
      try {
        let context;
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
  configure(printConfiguration = true) {
    if (this._configured) {
      throw new ConfigurationError("Cannot configure application multiple times");
    }
    const routesConfigurations = this._appConfigurator.buildRoutes();
    routesConfigurations.forEach((routeConfiguration) => this.validateRoute(routeConfiguration));
    routesConfigurations.forEach((routeConfiguration) => this.registerRouteInExpress(routeConfiguration));
    this._configured = true;
    if (printConfiguration) {
      this.printExpressConfig();
    }
  }
}
const ExpressAdapter = (express, appConfigurator) => {
  return new ExpressAdapterConfiguration(express, appConfigurator);
};
export {
  AppConfigurator,
  Application,
  Controller,
  ControllerConfiguration,
  ExpressAdapter,
  RequestError,
  Route,
  RouteConfigurator
};
//# sourceMappingURL=index.js.map
