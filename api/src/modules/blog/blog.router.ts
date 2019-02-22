import { Router } from "express";
import blogController from './controllers/controllers.blog';

class BlogModuleRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.build();
    }

    build() {
        this.router.get("/", blogController.good)
    }
}

const BlogRouter =  new BlogModuleRouter();
export default BlogRouter;