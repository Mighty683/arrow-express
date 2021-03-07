import Express from 'express';
import { ControllerConfiguration } from '../controller/controller';
export declare class AppConfigurator {
    private readonly _express;
    private readonly _controllers;
    private readonly port;
    private readonly logRequests;
    private _started;
    constructor(port: number, app: Express.Application, logRequests?: boolean);
    private static getRoutePath;
    private registerRoute;
    private handleRequest;
    private logRequest;
    private getExpressRoutesAsStrings;
    /**
     * Register controller in application.
     * @param controller - registered controller
     */
    registerController(controller: ControllerConfiguration): AppConfigurator;
    /**
     * Register controller in application.
     * @param controllers - controllers to register
     */
    registerControllers(...controllers: ControllerConfiguration[]): AppConfigurator;
    /**
     * Starts application, register controllers routes in express app
     * and connect to configured port
     */
    start(): void;
}
declare type ApplicationOptions = {
    port: number;
    app: Express.Application;
    logRequests?: boolean;
};
/**
 * Creates application core
 * @param options.port - port used by application
 * @param options.app - Express application used by application
 * @param options.logRequests - log requests, enabled by default
 */
export declare function Application(options: ApplicationOptions): AppConfigurator;
export {};
