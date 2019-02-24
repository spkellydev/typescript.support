import { ReflectiveInjector } from "./injection.factory";
import { EndpointMetadataOptions } from "../pipeline/pipeline.routers";
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

export function Get(route: EndpointMetadataOptions): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint: route,
            method: "get",
            target: key
        });
    }
}

export function Post(route: string): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint: route,
            method: "post",
            target: key
        });
    }
}

export function Patch(route: string): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint: route,
            method: "patch",
            target: key
        });
    }
}

export function Update(route: string): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint: route,
            method: "update",
            target: key
        });
    }
}

export function Delete(route: string): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint: route,
            method: "delete",
            target: key
        });
    }
}