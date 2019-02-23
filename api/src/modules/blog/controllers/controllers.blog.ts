import { Request, Response } from "express";
import { Service, Controller, Get } from "../../../core/injection/injection.decorator";

export class Foo { getGood() { return "world" } }

@Service(Foo)
@Controller("/blog")
class BlogController {
    constructor(private foo: Foo) {}
    
    @Get("/")
    good = (req: Request, res: Response) => {
        res.json({ blog: this.foo.getGood() });
    }
}

export default BlogController;