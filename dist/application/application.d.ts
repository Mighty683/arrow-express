import Express from "express";
import { ControllerConfiguration } from "../controller/controller";
export declare class AppConfigurator {
    private readonly _express;
    private readonly _controllers;
    private readonly logRequests;
    private _configured;
    /**
     * Create AppConfigurator
     * @param expressApplication - express application
     * @param logRequests - flag if requests should be logged, true by default
     */
    constructor(expressApplication: Express.Application, logRequests?: boolean);
    /**
     * Starts application, register controllers routes in express app
     * and connect to configured port.
     * @param printConfiguration - print express application routes enabled by default.
     */
    configure(printConfiguration?: boolean): void;
    /**
     * Register controller in application.
     * @param controller - registered controller
     */
    registerController(controller: ControllerConfiguration): AppConfigurator;
    /**
     * Register list of controllers in application.
     * @param controllers - controllers to register
     */
    registerControllers(...controllers: ControllerConfiguration[]): AppConfigurator;
    private printExpressConfig;
    private startControllers;
    private startController;
    private registerRouteInExpress;
    private createApplicationRequestHandler;
    private logRequest;
    private getExpressRoutesAsStrings;
    private static expressRouteAsString;
    /**
     * Get final route path
     * @param paths - array of paths
     * @private
     */
    private static getRoutePath;
    private static canSendResponse;
}
type ApplicationOptions = {
    app: Express.Application;
    logRequests?: boolean;
};
/**
 * Creates application core
 * @param options.app - Express application used by application
 * @param options.logRequests - log requests, enabled by default
 */
export declare function Application(options: ApplicationOptions): AppConfigurator;
export {};
