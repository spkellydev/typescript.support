import { PostEntity } from "../entities/post.entity";
import BaseModel from "../../core/mvc/mvc.model";

export default class BlogService extends BaseModel<PostEntity> {
    constructor() {
        super(PostEntity);
    }

    async getAllPosts() {
        return await this.repo.find();
    }

    async createPost(post: PostEntity) {
        let saved = await this.repo.save(post);
        return saved;
    }
}