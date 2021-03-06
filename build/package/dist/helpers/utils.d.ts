import { ClassType } from "../interfaces";
export declare type ArrayElementTypes<T extends any[]> = T extends Array<infer TElement> ? TElement : never;
export declare type InstanceSideOfClass<U extends ClassType> = U extends Function ? U["prototype"] : never;
