import slugify from "slugify";

export default class StringUtils {
    static safeSlug(slug: string): string {
        return slugify(slug);
    }
}