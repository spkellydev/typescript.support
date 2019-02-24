import { Connection, createConnection, Repository, EntitySchema } from "typeorm";
import { Sealed, Singleton } from "../security/object.decorator";

/**
 * Provides a connection to the database.
 */
@Sealed
@Singleton
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

    async connect(service: EntitySchema): Promise<Repository<any>> {
        return await this.connection.then(async db => {
            return await db.getRepository(service);
        }).catch(err => {
            throw new Error(err);
        })
    }
}