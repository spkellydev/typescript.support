import { PostEntity } from "../entities/post.entity";
import BaseModel from "../../core/mvc/mvc.model";
import { PostMetaEntity } from "../entities/postmeta.entity";
import { validate } from "class-validator";
import { decode } from "jwt-simple";
import { PostCategoryEntity } from "../entities/postcategory.entity";

export default class BlogService extends BaseModel<PostEntity> {
    constructor() {
        super(PostEntity);
    }

    async getAllPosts(): Promise<PostEntity[]> {
        const posts =  await this.repo.find({ relations: ["metadata", "author"] });
        return posts;
    }

    async createPost(p: PostEntity, m: PostMetaEntity, token: string): Promise<PostEntity|object> {
        const post = new PostEntity();
        post.build({
            title: p.title,
            content: p.content,
            cover: p.cover
        });
        const postErrors = await validate(post);
        if (postErrors.length > 0) return { error: postErrors }
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
        if (metaErrors.length > 0) return { error: metaErrors }
        // check for meta errors
        let saved = await this.repo.save(post);
        return saved;
    }

    async createCategory(name: string): Promise<PostCategoryEntity> {
        const categoryRepo = await this.repo.manager.getRepository(PostCategoryEntity);
        const category = new PostCategoryEntity();
        category.name = name;
        const cat = await categoryRepo.save(category);
        return cat;
    }

    async getCategories(): Promise<PostCategoryEntity[]> {
        const categoryRepo = await this.repo.manager.getRepository(PostCategoryEntity);
        return await categoryRepo.find();
    }
}