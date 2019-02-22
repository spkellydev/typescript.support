import { Router } from "express";
import { Controllers, ReflectiveInjector, Services } from './controllers/controllers.blog';

interface ControllerMetadata {
    route: string,
    method: string,
    target: string
}

class BlogModuleRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.build();
    }

    build() {
        Array.from(Controllers.entries()).map(module => {
            const [key, controller] = module;
            const service = Services.get(key);
            
            const injector = ReflectiveInjector.resolveAndCreate([service, controller]);
            const injected = injector.get(controller);

            let metadata = Reflect.getMetadata("routeCallbacks", injected);
            // endpoints
            Array.from(metadata).map((ep: ControllerMetadata) => {
                this.router[ep.method](ep.route, injected[ep.target]);
            });
        });
    }
}

const BlogRouter =  new BlogModuleRouter();
export default BlogRouter;