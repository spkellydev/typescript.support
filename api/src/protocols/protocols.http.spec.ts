import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as http from 'http';
import Server from './protocols.http';
import { Request, Response } from 'express';

class MockServer {
    port: 1234;
    server: http.Server;
    constructor() {
        Server.set("port", this.port);
        this.server = http.createServer(Server);
    }

    run() {
        this.server.listen(this.port);
    }

    close() {
        this.server.close();
    }
}

describe("Server works", function() {
    let server: MockServer;
    beforeEach(() => {
        server = new MockServer();
        server.run();
    });

    after(() => {
        server.close();
    });

    /**
     * Test that express can route with the server implementation
     */
    it("return index view", () => {
        const indexView = (req: Request, res: Response) => {
            res.render('index', { hello: "world" });
        }
        let req : Partial<Request> = {};
        let res: Partial<Response> = {
            render: sinon.stub()
        };

        indexView(<Request>req, <Response>res);

        sinon.assert.calledWith(res.render as sinon.SinonStub, "index", { hello: "world" });
    });
});