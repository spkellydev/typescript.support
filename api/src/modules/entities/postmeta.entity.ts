import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Length } from "class-validator";
import { PostEntity } from "./post.entity";

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

    build({ slug, description, categoryId, ...removed }) {
        this.slug = slug;
        this.description = description;
        this.categoryId = categoryId;
    }
}