import * as validator from "validator";

module StringValidator {
    export function validLength(str: string, len: number): boolean {
        if (str.length > len) return false;
        return true;
    }

    export function isEmail(str: string): boolean {
        return validator.isEmail(str);
    }
}

export module PostValidator {
    export function validPostTitle(title: string) {
        return StringValidator.validLength(title, 255);
    }
}

export module UserValidator {
    export function isEmail(str: string): boolean {
        return StringValidator.isEmail(str);
    }
}