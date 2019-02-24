import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 255 })
    title: string;
    @Column("text")
    content: string;
    @Column()
    cover: string;
    author: number;

    build({ title, content, cover, ...removed }) {
        this.title = title;
        this.content = content;
        this.cover = cover;
    }
}