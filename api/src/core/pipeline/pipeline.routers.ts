import { Router, Request, Response, NextFunction } from 'express';
import { ReflectiveInjector } from '../injection/injection.factory';
import { Module } from '../mvc/mvc.controller';
import { MustActivate } from './pipeline.effects';
const { ServiceMap, ControllerMap } = ReflectiveInjector;

export interface MiddlewareOptions {
    auth: MustActivate,
    log: MustActivate
}
export type Middleware = Partial<MiddlewareOptions>;

export type EndpointMetadataOptions = EndpointMetadataSupplied | string;
interface EndpointMetadata {
    endpoint: EndpointMetadataOptions,
    method: string,
    target: string
}

interface EndpointMetadataSupplied {
    route: string,
    middleware: Middleware
}

export default class RouterPipeline {
    router: Router;
    constructor(private modules: Array<Module>) {
        this.router = Router();
        this.build();
        // modules are intentionally unused
        this.modules = modules;
    }

    build() {
        // All controllers are added to a map. Iterate through the map and collect the path and controller class for every module
        Array.from(ControllerMap.entries()).map(module => {
            // parent path of the controller, controller class
            const [path, controller] = module;
            // get the service associated which the path provided
            const service = ServiceMap.get(path);
            // inject the service into controller and get an instance of class
            const injector = ReflectiveInjector.resolveAndCreate([service, controller]);
            // pull the injected controller from the injector
            const injected = injector.get(controller);
            // the injected class has the service attached to it, so now it's a safe time to start
            // pulling metadata out of the controller and it's associated methods
            const controllerRoute : string = Reflect.getMetadata("controller", injected);
            let metadata = Reflect.getMetadata("routeCallbacks", injected);
            
            // endpoints
            let middleware : Middleware = null;
            Array.from(metadata).map((ep: EndpointMetadata) => { // every endpoint
                // Middleware can be a string or an object -- the string is the final path fragment of the endpoint
                let fragment : string;
                if (typeof ep.endpoint === "string") fragment = ep.endpoint;
                else {
                    // an object middleware has a route and an object of associated middlewares
                    fragment = ep.endpoint.route;
                    middleware = ep.endpoint.middleware;
                }
                // combine the parent path from the controller with the
                // final path fragment from the method to create the route
                let route = `${controllerRoute}${fragment}`;
                
                // if there's middleware.
                // since the middleware object can have one or more keys, push the activated middleware into an array
                // a key could be "auth" or "log", something that's readable but has no real mission critical info
                let fns = [];
                if (middleware !== null) {
                    Object.keys(middleware).map(key => {
                        // mustActivate is a RequestHandler
                        // see: https://expressjs.com/en/guide/using-middleware.html
                        fns.push((<MustActivate>middleware[key]).mustActivate);
                    });
                }
                // build the route from the supplied metadata
                // ep.method : GET, POST, PATCH, UPDATE, DELETE
                // ep.target : InjectedController.targetMethod
                this.router[ep.method](route, [...fns], injected[ep.target]);
            });
        });
    }
}