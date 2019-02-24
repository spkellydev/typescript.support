import { Request, Response } from "express";
import { Service, Controller, Get, Post, Update, Delete } from "../../../core/injection/injection.decorator";
import { BaseControllerImpl, ControllerCrud } from "../../../core/mvc/mvc.controller";
import BlogService from "../blog.repo";
import AuthGuard from "../../../core/security/auth.guard";

const Guard = new AuthGuard();

@Service(BlogService)
@Controller("/blog")
class BlogController implements BaseControllerImpl, ControllerCrud {
    constructor(private service: BlogService) {}
    
    @Get("/")
    readAll = async (req: Request, res: Response) => {
        res.json({ posts: await this.service.getAllPosts() })
    }

    @Get("/post/:slug")
    readSingle = async (req: Request, res: Response) => {
        const { slug } = req.params;
        res.json({ slug });
    }

    @Post({
        route: "/post/create",
        middleware: { auth: Guard }
    })
    create = async (req: Request, res: Response) => {
        const { post, meta } = req.body;
        const token = req.headers["authorization"];
        const saved = await this.service.createPost(post, meta, token);
        res.json(saved);
    }

    @Update({
        route: "/post/:slug",
        middleware: { auth: Guard }
    })
    update(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }

    @Delete({
        route: "/post/:slug",
        middleware: { auth: Guard }
    })
    delete(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
}

export default BlogController;