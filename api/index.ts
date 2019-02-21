import * as Express from 'express';

class TypeScriptSupport {
    private app: Express.Application;
    private port: number;
    constructor(port?: number) {
        this.app = Express();
        this.port = port || 8080;
    }

    generate(): void {
        this.app.get("/", (req: Express.Request, res: Express.Response) => {
            res.json({ hello: "world" });
        });
    }

    run(callback: () => void = () => console.log("App started on port", this.port)): void {
        this.app.listen(this.port, callback);
    }
}

const app = new TypeScriptSupport();
app.generate();
app.run();