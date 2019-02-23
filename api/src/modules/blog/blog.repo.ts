import { Post } from "../entities/post.entity";
import BaseModel from "../../core/mvc/mvc.model";

export default class BlogService extends BaseModel<Post> {
    constructor() {
        super(Post);
    }

    getAllPosts() {
        return this.repo.find();
    }
}