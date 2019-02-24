import { PostEntity } from "../entities/post.entity";
import BaseModel from "../../core/mvc/mvc.model";
import { PostMetaEntity } from "../entities/postmeta.entity";
import { validate } from "class-validator";
import { decode } from "jwt-simple";

export default class BlogService extends BaseModel<PostEntity> {
    constructor() {
        super(PostEntity);
    }

    async getAllPosts() {
        return await this.repo.find();
    }

    async createPost(p: PostEntity, m: PostMetaEntity, token: string) {
        const post = new PostEntity();
        post.build({
            title: p.title,
            content: p.content,
            cover: p.cover
        });
        const postErrors = await validate(post);
        // check for post errors
        const meta = new PostMetaEntity();
        meta.build({
            slug: m.slug,
            description: m.description,
            categoryId: m.categoryId
        });
        post.metadata = meta;
        let jwt = await decode(token, "dummy_secret");
        post.author = jwt.sub;
        const metaErrors = await validate(meta);
        // check for meta errors
        let saved = await this.repo.save(post);
        return saved;
    }
}