"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
class TypeScriptSupport {
    constructor(port) {
        this.app = Express();
        this.port = port || 8080;
    }
    generate() {
        this.app.get("/", (req, res) => {
            res.json({ hello: "world" });
        });
    }
    run(callback = () => console.log("App started on port", this.port)) {
        this.app.listen(this.port, callback);
    }
}
const app = new TypeScriptSupport();
app.generate();
app.run();
//# sourceMappingURL=index.js.map