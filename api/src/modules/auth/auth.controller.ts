import { BaseControllerImpl } from "../../core/mvc/mvc.controller";
import { Controller, Post, Service } from "../../core/injection/injection.decorator";
import { Request, Response } from "express";
import AuthService, { Token } from "./auth.repo";
import UserEntity from "../entities/user.entity";

@Service(AuthService)
@Controller("/sign")
export default class AuthController implements BaseControllerImpl {
    constructor(private service: AuthService) {
        this.service = service;
    }

    @Post("/in")
    signin = async (req: Request, res: Response) => {
        let status = 200;
        const { email, password } = req.body;
        const user = new UserEntity();
        user.build({ email, password });
        const token: Token | string = await this.service.signInUser(user);
        if (token instanceof String) status = 403;
        res.status(status).json({ token })
    }

    @Post("/up")
    signup = async (req: Request, res: Response) => {
        let status = 200;
        const { email, password } = req.body;
        const user = new UserEntity();
        user.build({ email, password });
        const token : Token | string = await this.service.createUser(user);
        if (token instanceof String) status = 403;
        res.status(status).json(token);
    }
}