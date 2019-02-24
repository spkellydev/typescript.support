import { Request, Response } from "express";
import { Service, Controller, Get, Post } from "../../../core/injection/injection.decorator";
import { BaseControllerImpl } from "../../../core/mvc/mvc.controller";
import BlogService from "../blog.repo";
import { PostEntity } from "../../entities/post.entity";



@Service(BlogService)
@Controller("/blog")
class BlogController implements BaseControllerImpl {
    constructor(private service: BlogService) {}
    
    @Get("/")
    good = async (req: Request, res: Response) => {
        res.json({ hello: await this.service.getAllPosts() })
    }

    @Post("/post/create")
    gooder = async (req: Request, res: Response) => {
        const { title, content, cover } = req.body;
        const post = new PostEntity();
        post.build({ title, content, cover });
        const saved = await this.service.createPost(post);
        res.json(saved);
    }
}

export default BlogController;