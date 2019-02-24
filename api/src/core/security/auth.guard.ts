import { MustActivate } from "../pipeline/pipeline.effects";
import { Request, Response, NextFunction } from "express";
import { decode } from "jwt-simple";

/**
 * Checks for an authorization header and then checks that authorization header against the jwt decoder.
 * If the header doesn't exist, fall through; if the token is bad, reject.
 */
export default class AuthGuard implements MustActivate {
    mustActivate(req: Request, res: Response, next: NextFunction): void {
        if (!req.headers.authorization) {
            // fall through
            res.status(401).json({ bad: "request" }).end();
        } else {
            try {
                decode(req.headers.authorization, process.env.JWT_SECRET || "dummy_secret");
                // continue to the defined path
                next();
            } catch(err) {
                // reject
                res.status(403).json({ bad: "request" }).end();
            }
        }
    }
}