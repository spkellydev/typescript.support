import { Request, Response, NextFunction } from "express";

/**
 * Interface for middlewares which must activate before a request is processed.
 * Use case: check for authorization headers
 */
export interface MustActivate {
    mustActivate: (req: Request, res: Response, next: NextFunction) => void
}