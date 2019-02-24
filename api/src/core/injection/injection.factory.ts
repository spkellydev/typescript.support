import { Controller } from "../mvc/mvc.controller";
import { Model } from "../mvc/mvc.model";

export class ReflectiveInjector {
    private static records: { token:any, deps:any }[] = []
    static ControllerMap = new Map<string, Controller>();
    static ServiceMap = new Map<string, Model>(); 
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
