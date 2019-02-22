import { Router } from "express";
import blogController, { BlogController } from './controllers/controllers.blog';

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
        
        let metadata = Reflect.getMetadata("routeCallbacks", blogController);
        // endpoints
        Array.from(metadata).map((ep: ControllerMetadata) => {
            this.router[ep.method](ep.route, blogController[ep.target]);
        });
        // console.log(metadata);
        // this.router.get("/", blogController.good)
    }
}

const BlogRouter =  new BlogModuleRouter();
export default BlogRouter;