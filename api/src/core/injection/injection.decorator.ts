import { ReflectiveInjector } from "./injection.factory";
import { EndpointMetadataOptions } from "../pipeline/pipeline.routers";
import { Model } from "../mvc/mvc.model";
import { Controller } from "../mvc/mvc.controller";
const { ServiceMap, ControllerMap } = ReflectiveInjector;
const ANNOTATIONS = "__annotations__";

/**
 * Allows any class to become an injectable constructor param.
 */
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

/**
 * Inject a service directly into the constructor.
 * TODO: Strong typing on service param
 * @param service repository to inject
 */
export function Service(service: Model) {
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

/**
 * Defines an API controller
 * @param endpoint parent path for any endpoint
 */
export function Controller(endpoint: string): ClassDecorator {
    return (target) => {
        ControllerMap.set(target.name, target as Controller);
        Reflect.defineMetadata('controller', endpoint, target.prototype);
        let routeFns: Array<() => void> = Reflect.getMetadata("routeCallbacks", target.prototype);
        if (routeFns) {
            routeFns.forEach(fn => fn);
        }
        
        return target;
    }
}

/**
 * Defines a get request. Pass in a string or an object defining route and middleware.
 * @param endpoint endpoint options for controller child
 */
export function Get(endpoint: EndpointMetadataOptions): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint,
            method: "get",
            target: key
        });
    }
}

/**
 * Defines a post request. Pass in a string or an object defining route and middleware.
 * @param endpoint endpoint options for controller child
 */
export function Post(endpoint: EndpointMetadataOptions): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint,
            method: "post",
            target: key
        });
    }
}

/**
 * Defines a patch request. Pass in a string or an object defining route and middleware.
 * @param endpoint endpoint options for controller child
 */
export function Patch(endpoint: EndpointMetadataOptions): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint,
            method: "patch",
            target: key
        });
    }
}

/**
 * Defines an update request. Pass in a string or an object defining route and middleware.
 * @param endpoint endpoint options for controller child
 */
export function Update(endpoint: EndpointMetadataOptions): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint,
            method: "put",
            target: key
        });
    }
}

/**
 * Defines a delete request. Pass in a string or an object defining route and middleware.
 * @param endpoint endpoint options for controller child
 */
export function Delete(endpoint: EndpointMetadataOptions): any {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let routeFns = Reflect.getMetadata("routeCallbacks", target);
        if (!routeFns) {
            Reflect.defineMetadata("routeCallbacks", routeFns = [], target);
        }
        
        routeFns.push({
            endpoint,
            method: "delete",
            target: key
        });
    }
}