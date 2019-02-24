import * as debug from "debug";
import * as http from "http";
import "reflect-metadata";

import Server from "./src/protocols/protocols.http";
import autoscan from "./autoscan";

debug("ts-support:server");

class Main {
    port: any = this.normalizePort(process.env.PORT || 8080);
    server: http.Server;
    constructor() {
        Server.set("port", this.port);
        this.server = http.createServer(Server);
    }

    run() {
        this.server.listen(this.port);
        this.server.on("error", this.onError);
        this.server.on("listening", this.onListening);
    }

    private normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === "string" ? parseInt(val, 10) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    onListening = () => {
        const addr = this.server.address();
        const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    }

    onError = (error: NodeJS.ErrnoException): void => {
        if (error.syscall !== "listen") {
            console.log(error);
        }
        const bind = typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port;
        switch (error.code) {
            case "EACCES":
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                console.log(error);
        }
    }
}

new Main().run();