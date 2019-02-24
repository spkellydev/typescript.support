/**
 * Provides a type to check controllers on.
 */
export type Controller = {}
export abstract class BaseControllerImpl implements Controller {}
export interface ControllerCrud extends Controller {
    readAll(...any: any): void
    create(...any: any): void
    update(...any: any): void
    delete(...any: any): void
    readSingle(...any: any): void
}

/**
 * Base module which provides the Module type to every module in the application. Every module needs to have their controllers
 * added so that the controller's decorators are evaluated and reflected upon. If a controller isn't added to the array, then
 * the routes will never be evaluated and result in a 404.
 * Modules are not meant to have any functionality outside of providing a mechanism to collect the controller metadata. In a
 * future version of the app, this implementation will be replaced by a Module decorator to prevent the uselesness of these
 * classes. Until then, the classes will be kept lean as possible and should not have any logic of their own.
 */
export abstract class BaseModuleImpl implements Module {
    controllers: BaseControllerImpl[]
}

/**
 * Module is strictly for providing a way to detect modules to pass into the RouterPipeline. Every module should inherit this type
 * which provides a way to typecheck modules globally.
 */
export type Module = {}
