import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import StringUtils from "../../core/utils/string.utils";
import { PostMetaEntity } from "./postmeta.entity";
import { PostEntity } from "./post.entity";

@Entity("PostCategory")
export class PostCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @BeforeInsert()
    safeSlug() {
        this.name = StringUtils.safeSlug(this.name);
    }
}