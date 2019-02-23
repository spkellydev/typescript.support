import { Repository } from "typeorm";
import DatabaseManager from "../database/manager.database";

export default abstract class BaseModel<T> {
    repo: Repository<T>;
    private manager: DatabaseManager;
    constructor(private model) {
        this.manager = new DatabaseManager();
        this.getRepo();
    }

    private async getRepo() {
        this.repo = await this.manager.connect(this.model) as Repository<T>;
    }
}