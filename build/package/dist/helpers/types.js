"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const timestamp_1 = require("../scalars/timestamp");
const isodate_1 = require("../scalars/isodate");
const build_context_1 = require("../schema/build-context");
const errors_1 = require("../errors");
const class_transformer_1 = require("class-transformer");
function convertTypeIfScalar(type) {
    if (type instanceof graphql_1.GraphQLScalarType) {
        return type;
    }
    const scalarMap = build_context_1.BuildContext.scalarsMaps.find(it => it.type === type);
    if (scalarMap) {
        return scalarMap.scalar;
    }
    switch (type) {
        case String:
            return graphql_1.GraphQLString;
        case Boolean:
            return graphql_1.GraphQLBoolean;
        case Number:
            return graphql_1.GraphQLFloat;
        case Date:
            return build_context_1.BuildContext.dateScalarMode === "isoDate" ? isodate_1.GraphQLISODateTime : timestamp_1.GraphQLTimestamp;
        default:
            return undefined;
    }
}
exports.convertTypeIfScalar = convertTypeIfScalar;
function wrapWithTypeOptions(typeOwnerName, type, typeOptions, nullableByDefault) {
    if (!typeOptions.array &&
        (typeOptions.nullable === "items" || typeOptions.nullable === "itemsAndList")) {
        throw new errors_1.WrongNullableListOptionError(typeOwnerName, typeOptions.nullable);
    }
    if (typeOptions.defaultValue !== undefined &&
        (typeOptions.nullable === false || typeOptions.nullable === "items")) {
        throw new errors_1.ConflictingDefaultWithNullableError(typeOwnerName, typeOptions.defaultValue, typeOptions.nullable);
    }
    let gqlType = type;
    if (typeOptions.array) {
        if (typeOptions.nullable === "items" ||
            typeOptions.nullable === "itemsAndList" ||
            (typeOptions.nullable === undefined && nullableByDefault === true)) {
            gqlType = new graphql_1.GraphQLList(gqlType);
        }
        else {
            gqlType = new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(gqlType));
        }
    }
    if (typeOptions.defaultValue === undefined &&
        (typeOptions.nullable === false ||
            (typeOptions.nullable === undefined && nullableByDefault === false) ||
            typeOptions.nullable === "items")) {
        gqlType = new graphql_1.GraphQLNonNull(gqlType);
    }
    return gqlType;
}
exports.wrapWithTypeOptions = wrapWithTypeOptions;
const simpleTypes = [String, Boolean, Number, Date, Array, Promise];
function convertToType(Target, data) {
    // skip converting undefined and null
    if (data == null) {
        return;
    }
    // skip converting scalars (object scalar mostly)
    if (Target instanceof graphql_1.GraphQLScalarType) {
        return data;
    }
    // skip converting simple types
    if (simpleTypes.includes(data.constructor)) {
        return data;
    }
    // skip converting already converted types
    if (data instanceof Target) {
        return data;
    }
    // return Object.assign(new Target(), data);
    return class_transformer_1.plainToClass(Target, data);
}
exports.convertToType = convertToType;
function getEnumValuesMap(enumObject) {
    const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
    const enumMap = enumKeys.reduce((map, key) => {
        map[key] = enumObject[key];
        return map;
    }, {});
    return enumMap;
}
exports.getEnumValuesMap = getEnumValuesMap;
