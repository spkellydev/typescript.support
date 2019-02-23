import { Request, Response } from "express";
import { Service, Controller, Get } from "../../../core/injection/injection.decorator";
import { BaseControllerImpl } from "../../../core/mvc/mvc.interfaces";
import { createConnection } from "typeorm";
import BlogService from "../blog.repo";



@Service(BlogService)
@Controller("/blog")
class BlogController implements BaseControllerImpl {
    constructor(private service: BlogService) {}
    
    @Get("/")
    good = async (req: Request, res: Response) => {
        res.json({ hello: await this.service.getAllPosts() })
    }
}

export default BlogController;