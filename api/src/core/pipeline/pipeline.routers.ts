import { Router } from 'express';
import { ReflectiveInjector } from '../injection/injection.factory';
import { BaseModuleImpl } from '../mvc/mvc.interfaces';
const { ServiceMap, ControllerMap } = ReflectiveInjector;

interface EndpointMetadata {
    route: string,
    method: string,
    target: string
}

export default class RouterPipeline {
    router: Router;
    constructor(private modules: Array<BaseModuleImpl>) {
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
            let controllerRoute = Reflect.getMetadata("controller", injected);
            let metadata = Reflect.getMetadata("routeCallbacks", injected);
            // endpoints
            Array.from(metadata).map((ep: EndpointMetadata) => {
                let route = `${controllerRoute}${ep.route}`
                this.router[ep.method](route, injected[ep.target]);
            });
        });
    }
}