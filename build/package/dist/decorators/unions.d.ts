import { ClassType } from "../interfaces";
import { InstanceSideOfClass, ArrayElementTypes } from "../helpers/utils";
export interface UnionTypeConfig<ObjectTypes extends ClassType[]> {
    name: string;
    description?: string;
    types: ObjectTypes;
}
export declare type UnionFromClasses<T extends any[]> = InstanceSideOfClass<ArrayElementTypes<T>>;
export declare function createUnionType<T extends ClassType[]>({ types, name, description, }: UnionTypeConfig<T>): UnionFromClasses<T>;
