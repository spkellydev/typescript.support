export interface BaseControllerImpl {}
export abstract class BaseModuleImpl implements Module {
    controllers: BaseControllerImpl[]
}

export type Module = {}
