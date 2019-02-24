import { BaseModuleImpl } from "../../core/mvc/mvc.controller";
import AuthController from "./auth.controller";

/**
 * Authentication module: Provides JWT based authentication for users.
 */
export default class AuthModule implements BaseModuleImpl {
    controllers = [AuthController];
}