export module StringValidator {
    export function validPostTitle(title: string): boolean {
        if (title.length > 255) return false;
        return true;
    }
}