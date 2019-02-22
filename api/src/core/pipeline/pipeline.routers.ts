import { Application } from 'express';

export default class RouterPipeline {
    private modules: any[];
    private app: Application;
    constructor(app: Application, modules: any[]) {
        this.app = app;
        this.modules = modules;
    }

    buildRouters() {
        this.modules.map(module => {
            this.app.use(module.prefix, module.router);
        });
    }
}