import { Connection, createConnection, Repository } from "typeorm";

export default class DatabaseManager {
    connection: Promise<Connection>;
    constructor() {
        this.connection = createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "pass",
            database: "tssupport",
            entities: [
                __dirname + "../../../**/*.entity.js"
            ],
            synchronize: true
        });
    }

    async connect(service) {
        return await this.connection.then(async db => {
            return await db.getRepository(service);
        }).catch(err => {
            throw new Error(err);
        })
    }
}