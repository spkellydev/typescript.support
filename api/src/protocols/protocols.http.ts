/**
 * @package Typescript.support Express API
 * @version 0.0.0.0
 */
import * as logger from "morgan";
import * as helmet from "helmet";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import { RequestHandler } from "express-serve-static-core";
import RouterPipeline from "../core/pipeline/pipeline.routers";
import BlogModule from "../modules/blog/blog.module";
import { Module } from "../core/mvc/mvc.controller";
import AuthModule from "../modules/auth/auth.module";

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
        // middleware
        const head = helmet();
        const logging = logger(dev ? "dev" : "combined");
        const parser = bodyParser.urlencoded({ extended: true });
        const json = bodyParser.json();
        const gzip = compression();
        let middlewares: Middlewares = [head, logging, parser, json, gzip];
        this.runMiddlewares(middlewares);
    }

    /**
     * Inject middlewares into the app
     * @param middlewares Application wide middlewares
     */
    private runMiddlewares(middlewares: Middlewares) {
        middlewares.map(m => this.app.use(m));
    }

    /**
     * Scaffold the routes for the application. The RouterPipeline will activate the routes before runtime
     * as the router is created via reflection and decorators.
     */
    routes() {
        // Collect the app modules
        const modules : Module[] = [AuthModule, BlogModule];
        // Router pipeline will build when constructed
        const routerPipeline = new RouterPipeline(modules);
        // take the router and add it to the app context.
        this.app.use(routerPipeline.router);
    }
}

export default new HttpServer().app;