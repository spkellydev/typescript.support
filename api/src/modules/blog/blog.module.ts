import BlogController from "./controllers/controllers.blog";
import { BaseModuleImpl } from "../../core/mvc/mvc.controller";

export default class BlogModule extends BaseModuleImpl {  
    controllers = [BlogController];
}