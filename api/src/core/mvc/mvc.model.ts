import { Repository } from "typeorm";
import DatabaseManager from "../database/manager.database";

export type Model = {}
export default abstract class BaseModel<T> implements Model {
    repo: Repository<T>;
    private manager: DatabaseManager;
    constructor(private model) {
        this.manager = new DatabaseManager();
        this.getRepo();
    }

    private async getRepo() {
        this.repo = await this.manager.connect(this.model) as Repository<T>;
    }

    async getCustomRepo(model) {
        return await this.manager.connect(model);
    }
}