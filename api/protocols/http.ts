/**
 * @package Typescript.support Express API
 * @version 0.0.0.0
 */
import * as fs from "fs";
import * as cors from "cors";
import * as logger from "morgan";
import * as helmet from "helmet";
import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import { RequestHandler } from "express-serve-static-core";

const dev = process.env.NODE_ENV !== "production";
type Middlewares = RequestHandler[];

/**
 * @name HttpServer
 * @description HttpServer class handles all the necessary code to bootstrap the express server with middleware and connection to database
 */

class HttpServer {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.generate();
        this.routes();
    }

    generate() {
        // connect to the database

        // middleware
        const head = helmet();
        const logging = logger(dev ? "dev" : "combined");
        const parser = bodyParser.urlencoded({ extended: true });
        const json = bodyParser.json();
        const gzip = compression();
        let middlewares: Middlewares = [head, logging, parser, json, gzip];
        this.runMiddlewares(middlewares);
    }

    private runMiddlewares(middlewares: Middlewares) {
        middlewares.map(m => this.app.use(m));
    }

    routes() {
        const router = express.Router();
        this.app.use("/", (req, res) => {
            res.json({ hello: "world" });
        });
    }
}

export default new HttpServer().app;