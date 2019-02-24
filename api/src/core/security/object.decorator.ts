/**
 * Prevent classes from being extended
 * @param constructor any constructor for a class
 */
export function Sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

/**
 * Creates a singleton, if one doesnt exist, for the target. Once a singleton exists, it is returned
 * @param target any class
 */
export function Singleton(target: any) {
    //static instance getter method
    target.getInstance = function (...args: any[]) {
        // save a reference to the original constructor
        const original = target;
        // a utility function to generate instance of a class
        function construct(constructor) {
            const c: any = function () {
                return constructor.apply(this, args);
            }
            c.prototype = constructor.prototype;
            return new c();
        }

        //new constructor
        const f: any = function () {
            return construct(original);
        }

        if (!original.instance) {
            // copy prototype so intanceof operator still works
            f.prototype = original.prototype;
            original.instance = new f();
        }

        return original.instance;
    }
}