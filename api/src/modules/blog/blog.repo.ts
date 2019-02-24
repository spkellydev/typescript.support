import { PostEntity } from "../entities/post.entity";
import BaseModel from "../../core/mvc/mvc.model";
import { PostValidator } from "../../core/security/string.validator";

export default class BlogService extends BaseModel<PostEntity> {
    constructor() {
        super(PostEntity);
    }

    async getAllPosts() {
        return await this.repo.find();
    }

    async createPost(post: PostEntity) {
        let valid = this.validate(post);
        if (valid instanceof Object) {
            return { created: false };
        }

        let saved = await this.repo.save(post);
        return saved;
    }

    private validate(post: PostEntity): boolean | {} {
        const title =  PostValidator.validPostTitle(post.title);
        if (!title) {
            return {
                valid: false,
                position: title
            }
        }
        return true;
    }
}