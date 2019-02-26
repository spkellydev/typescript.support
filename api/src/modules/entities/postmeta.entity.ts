import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import { Length } from "class-validator";
import { PostEntity } from "./post.entity";
import StringUtils from "../../core/utils/string.utils";
import { PostCategoryEntity } from "./postcategory.entity";

@Entity("PostMeta")
export class PostMetaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Length(0, 120)
    @Column({
        unique: true
    })
    slug: string;

    @Length(100, 255)
    @Column()
    description: string;

    @Column("int")
    categoryId?: number
    
    @OneToOne(type => PostEntity)
    @JoinColumn()
    post: PostEntity

    @BeforeInsert()
    safeSlug() {
        this.slug = StringUtils.safeSlug(this.slug);
    }

    build({ slug, description, categoryId, ...removed }) {
        this.slug = slug;
        this.description = description;
        this.categoryId = categoryId;
    }
}