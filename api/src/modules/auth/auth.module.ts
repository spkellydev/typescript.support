import { BaseModuleImpl } from "../../core/mvc/mvc.interfaces";
import AuthController from "./auth.controller";

export default class AuthModule implements BaseModuleImpl {
    controllers = [AuthController];
}