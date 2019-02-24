import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { hashSync, compare } from "bcryptjs";

@Entity("User")
export default class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @Length(6, 18)
    password: string;

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