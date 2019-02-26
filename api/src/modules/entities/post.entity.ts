import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm';
import { Length, IsFQDN, IsUrl } from 'class-validator';
import { PostMetaEntity } from './postmeta.entity';
import UserEntity from './user.entity';

@Entity("Post")
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Length(3, 255)
    @Column({ length: 255 })
    title: string;
    
    @Column("text")
    content: string;

    @IsUrl()
    @Column()
    cover: string;

    @ManyToOne(type => UserEntity, author => author.posts)
    author: UserEntity;

    @OneToOne(type => PostMetaEntity, metadata => metadata.post, {
        cascade: true
    })
    metadata: PostMetaEntity

    build({ title, content, cover, ...removed }) {
        this.title = title;
        this.content = content;
        this.cover = cover;
    }
}