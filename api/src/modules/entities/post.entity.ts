import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsFQDN } from 'class-validator';

@Entity("Post")
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Length(3, 255)
    @Column({ length: 255 })
    title: string;
    
    @Column("text")
    content: string;

    @IsFQDN()
    @Column()
    cover: string;
    author: number;

    build({ title, content, cover, ...removed }) {
        this.title = title;
        this.content = content;
        this.cover = cover;
    }
}