import { Request, Response, NextFunction } from "express";

export interface MustActivate {
    mustActivate: (req: Request, res: Response, next: NextFunction) => void
}