import { Router, Request, Response, NextFunction } from 'express';
import { ReflectiveInjector } from '../injection/injection.factory';
import { Module } from '../mvc/mvc.interfaces';
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
        this.modules = modules;
    }

    build() {
        Array.from(ControllerMap.entries()).map(module => {
            const [key, controller] = module;
            const service = ServiceMap.get(key);
            const injector = ReflectiveInjector.resolveAndCreate([service, controller]);
            const injected = injector.get(controller);
            const controllerRoute : string = Reflect.getMetadata("controller", injected);
            let middleware : Middleware = null;
            let metadata = Reflect.getMetadata("routeCallbacks", injected);
            // endpoints
            Array.from(metadata).map((ep: EndpointMetadata) => {
                let fragment : string;
                if (typeof ep.endpoint === "string") fragment = ep.endpoint;
                else {
                    fragment = ep.endpoint.route;
                    middleware = ep.endpoint.middleware;
                } 
                let route = `${controllerRoute}${fragment}`
                let fns = [];
                if (middleware !== null) {
                    Object.keys(middleware).map(intermediary => {
                        fns.push((<MustActivate>middleware[intermediary]).mustActivate);
                    });
                }

                this.router[ep.method](route, [...fns], injected[ep.target]);
            });
        });
    }
}