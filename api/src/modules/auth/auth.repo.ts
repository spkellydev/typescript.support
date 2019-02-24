import BaseModel from "../../core/mvc/mvc.model";
import UserEntity from "../entities/user.entity";
import * as jwt from 'jwt-simple';
import { validate } from "class-validator";

// provides a Token type.
export type Token = { token: string };

/**
 * A repository and means of communicating with the database for any UserEntity
 */
export default class AuthService extends BaseModel<UserEntity> {
    constructor() {
        super(UserEntity);
    }

    /**
     * @uses jwt-simple
     * @param user validated user
     */
    private tokenForUser(user: UserEntity): Token {
        const timestamp = new Date().getTime();
        const token = jwt.encode(
            { sub: user.id, iat: timestamp },
            process.env.JWT_SECRET || "dummy_secret"
        )
        return { token };
    }

    /**
     * @uses validator
     * @param user non-validated user
     */
    async createUser(user: UserEntity): Promise<Token | string> {
        const errors = await validate(user);
        if (errors.length > 0) {
            // TODO: reduce errors
            return "errors creating user";
        }
        const foundUser = await this.repo.find({ email: user.email });
        if (foundUser.length > 0) return "cannot create user";

        const saved = await this.repo.save(user);
        return this.tokenForUser(saved);
    }

    /**
     * @uses validator
     * @param user non-validated user
     */
    async signInUser(user: UserEntity): Promise<Token | string> {
        const errors = await validate(user);
        if (errors.length > 0) return "errors creating users";
        const foundUser = await this.repo.find({ email: user.email });
        if (foundUser.length < 1) return "error finding user";

        const validUser = await foundUser[0].validatePassword(user.password);
        if (!validUser) return "error logging in";
        return this.tokenForUser(foundUser[0]);
    }
}