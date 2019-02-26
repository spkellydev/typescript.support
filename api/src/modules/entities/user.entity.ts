import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { hashSync, compare } from "bcryptjs";
import { PostEntity } from "./post.entity";

@Entity("User")
export default class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string;

    @Column({ select: false })
    @Length(6, 18)
    password: string;

    @OneToMany(type => PostEntity, post => post.author)
    posts: PostEntity[]

    /**
     * @param userobj destructured user object
     */
    build({ email, password, ...removed }) {
        this.email = email;
        this.password = password;
    }

    /**
     * @uses bcryptjs
     */
    @BeforeInsert()
    hashPassword() {
        // typeorm doesn't handle asynchronous methods before insert very well,
        // so the synchronous version is better suited.
        this.password = hashSync(this.password, 10);
    }

    /**
     * @uses bcryptjs
     * @param suppliedPassword password from request
     */
    async validatePassword(suppliedPassword: string): Promise<boolean> {
        return await compare(suppliedPassword, this.password)
    }
}