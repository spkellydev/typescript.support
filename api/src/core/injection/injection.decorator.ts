import { ReflectiveInjector } from "./injection.factory";
const { ServiceMap, ControllerMap } = ReflectiveInjector;
const ANNOTATIONS = "__annotations__";

export function Injectable() {
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

export function Service(service) {
    function DecoratorFactory(cls: any, objOrType?: any) {
        ServiceMap.set(cls.name, service);
        const annotationInstance = objOrType;
        const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
            (cls as any)[ANNOTATIONS] :
            Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
        annotations.push(annotationInstance);
        return cls;
    }
  return DecoratorFactory
}

export function Controller(route: string): ClassDecorator {
    return (target) => {
        ControllerMap.set(target.name, target);
        Reflect.defineMetadata('controller', route, target.prototype);
        let routeFns: Array<() => void> = Reflect.getMetadata("routeCallbacks", target.prototype);
        if (routeFns) {
            routeFns.forEach(fn => fn);
        }
        
        return target;
    }
}

export function Get(route: string): any {
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