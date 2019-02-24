import { MustActivate } from "../pipeline/pipeline.effects";
import { Request, Response, NextFunction } from "express";
import { decode } from "jwt-simple";

export default class AuthGuard implements MustActivate {
    mustActivate(req: Request, res: Response, next: NextFunction): void {
        if (!req.headers.authorization) {
            res.status(401).json({ bad: "request" }).end();
        } else {
            try {
                decode(req.headers.authorization, process.env.JWT_SECRET || "dummy_secret");            
                next();
            } catch(err) {
                res.status(403).json({ bad: "request" }).end();
            }
        }
    }
}