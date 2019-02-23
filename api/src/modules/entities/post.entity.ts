import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 255 })
    title: string;
    @Column("text")
    content: string;
    @Column()
    cover: string;
    author: number;
}