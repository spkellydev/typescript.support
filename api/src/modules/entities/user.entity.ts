import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { hash, hashSync, compare } from "bcryptjs";

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

    build({ email, password, ...removed }) {
        this.email = email;
        this.password = password;
    }

    @BeforeInsert()
    hashPassword() {
        this.password = hashSync(this.password, 10);
    }

    async validatePassword(suppliedPassword: string): Promise<boolean> {
        return await compare(this.password, suppliedPassword)
    }
}