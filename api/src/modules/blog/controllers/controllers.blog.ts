import "reflect-metadata";
import { Request, Response } from "express";

const ANNOTATIONS = "__annotations__";

export const Controllers = new Map();
export const Services = new Map();

export class ReflectiveInjector {
    private static records: { token:any, deps:any }[] = []

    static resolveAndCreate(tokens: Array<any>) {
        tokens.forEach((token:any)=> {
            ReflectiveInjector.records.push({
                token,
                deps: Reflect.getOwnMetadata('design:paramtypes', token)
            })
        })
        return this
    }
    static get(_token: any) {
        // get the `token` from the record set
        const [record] = ReflectiveInjector.records.filter((record)=>{
            return record.token == _token
        })
        let {token, deps} = record

        // resolve dependencies into instances
        deps = deps.map((dep: any)=>{ return new dep() })

        // create the instance of the token with the resolved dependencies
        return new token(...deps)
    }
}

function Injectable() {
    function DecoratorFactory(cls: any, objOrType?: any) {
        const annotationInstance = objOrType;
        const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
            (cls as any)[ANNOTATIONS] :
            Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
        annotations.push(annotationInstance);
        return cls;
    }
  return DecoratorFactory
}

function Service(service) {
    function DecoratorFactory(cls: any, objOrType?: any) {
        Services.set(cls.name, service);
        const annotationInstance = objOrType;
        const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
            (cls as any)[ANNOTATIONS] :
            Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
        annotations.push(annotationInstance);
        return cls;
    }
  return DecoratorFactory
}

function Controller(route: string): ClassDecorator {
    return (target) => {
        Controllers.set(target.name, target);
        Reflect.defineMetadata('controller', route, target.prototype);
        let routeFns: Array<() => void> = Reflect.getMetadata("routeCallbacks", target.prototype);
        if (routeFns) {
            routeFns.forEach(fn => fn);
        }
        
        return target;
    }
}

function Get(route: string): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            route,
            method: "get",
            target: key
        });
    }
}

export class Foo { getGood() { return "good" } }

@Service(Foo)
@Controller("/blog")
export class BlogController {
    constructor(private foo: Foo) {}
    
    @Get("/")
    good = (req: Request, res: Response) => {
        res.json({ blog: this.foo.getGood() });
    }
}

export default BlogController;