import { Request, Response } from "express";
import { Service, Controller, Get, Post, Update, Delete } from "../../../core/injection/injection.decorator";
import { BaseControllerImpl, ControllerCrud } from "../../../core/mvc/mvc.controller";
import BlogService from "../blog.repo";
import AuthGuard from "../../../core/security/auth.guard";
import { PostCategoryEntity } from "../../entities/postcategory.entity";

const Guard = new AuthGuard();

@Service(BlogService)
@Controller("/blog")
class BlogController implements BaseControllerImpl, ControllerCrud {
    constructor(private service: BlogService) {}
    
    @Get("/")
    readAll = async (req: Request, res: Response) => {
        res.json({ posts: await this.service.getAllPosts() })
    }

    @Post({
        route: "/post/create",
        middleware: { auth: Guard }
    })
    create = async (req: Request, res: Response) => {
        const { post, meta } = req.body;
        const token = req.headers["authorization"];
        let result;
        try {
            result = await this.service.createPost(post, meta, token);
        } catch(err) {
            result = err;
        }
        res.json(result);
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

    @Get("/post/categories")
    readAllCategories = async (req: Request, res: Response): Promise<void> => {
        const categories = await this.service.getCategories();
        res.json(categories);
    }

    @Post("/post/category/create")
    createCategory = async (req: Request, res: Response): Promise<void> => {
        const { name } = req.body;
        let cat: PostCategoryEntity;
        try {
            cat = await this.service.createCategory(name);
        } catch(err) {
            console.log(err);
        }
        res.json(cat);
    }

    @Get("/post/:slug")
    readSingle = async (req: Request, res: Response) => {
        const { slug } = req.params;
        res.json({ slug });
    }
}

export default BlogController;