"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const decorators_1 = require("../helpers/decorators");
function InterfaceType(nameOrOptions, maybeOptions) {
    const { name, options } = decorators_1.getNameDecoratorParams(nameOrOptions, maybeOptions);
    return target => {
        getMetadataStorage_1.getMetadataStorage().collectInterfaceMetadata({
            name: name || target.name,
            target,
            description: options.description,
            isAbstract: options.isAbstract,
        });
    };
}
exports.InterfaceType = InterfaceType;
