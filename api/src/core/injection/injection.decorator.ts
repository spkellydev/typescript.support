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