import { GraphQLFieldResolver, GraphQLScalarType, GraphQLEnumType } from "graphql";

import { BuildSchemaOptions, buildSchema } from "./buildSchema";

export interface EnumValuesMap {
  [key: string]: any;
}

export interface TypeFieldsMap {
  [fieldName: string]: GraphQLFieldResolver<any, any>;
}

export interface ResolversMap {
  [typeName: string]: TypeFieldsMap | GraphQLScalarType | EnumValuesMap;
}

export async function buildResolversMap(options: BuildSchemaOptions): Promise<ResolversMap> {
  const schema = await buildSchema(options);
  const typeMap = schema.getTypeMap();
  return Object.keys(typeMap)
    .filter(typeName => !typeName.includes("__"))
    .reduce<ResolversMap>((resolversMap, typeName) => {
      const type = typeMap[typeName];
      if ("getFields" in type) {
        const fields = type.getFields();
        resolversMap[typeName] = Object.keys(fields).reduce<TypeFieldsMap>(
          (fieldsMap, fieldName) => {
            const field = fields[fieldName];
            if ("resolve" in field && field.resolve) {
              fieldsMap[fieldName] = field.resolve;
            }
            return fieldsMap;
          },
          {},
        );
      }
      if (type instanceof GraphQLScalarType) {
        resolversMap[typeName] = type;
      }
      if (type instanceof GraphQLEnumType) {
        resolversMap[typeName] = type.getValues().reduce<EnumValuesMap>((enumMap, enumValue) => {
          enumMap[enumValue.name] = enumValue.value;
          return enumMap;
        }, {});
      }
      return resolversMap;
    }, {});
}
