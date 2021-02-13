import Express from 'express';
import { ControllerConfiguration } from '../controller/controller';
export declare class AppConfigurator {
    private readonly _express;
    private readonly _controllers;
    private readonly port;
    private _started;
    constructor(port: number, app: Express.Application);
    private static getRoutePath;
    private registerRoute;
    private static handleRequest;
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
};
/**
 * Creates application core
 * @param options.port - port used by application
 * @param options.app - Express application used by application
 */
export declare function Application(options: ApplicationOptions): AppConfigurator;
export {};
