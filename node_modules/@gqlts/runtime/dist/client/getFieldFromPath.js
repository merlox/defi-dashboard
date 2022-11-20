"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldFromPath = void 0;
var tslib_1 = require("tslib");
var lodash_startswith_1 = tslib_1.__importDefault(require("lodash.startswith"));
function getFieldFromPath(root, path) {
    var current;
    if (!root)
        throw new Error("root type is not provided");
    if (path.length === 0)
        throw new Error("path is empty");
    path.forEach(function (f) {
        var type = current ? current.type : root;
        if (!type.fields)
            throw new Error("type `".concat(type.name, "` does not have fields"));
        var possibleTypes = Object.keys(type.fields)
            .filter(function (i) { return (0, lodash_startswith_1.default)(i, "on_"); })
            .reduce(function (types, fieldName) {
            var field = type.fields && type.fields[fieldName];
            if (field)
                types.push(field.type);
            return types;
        }, [type]);
        var field = null;
        possibleTypes.forEach(function (type) {
            var found = type.fields && type.fields[f];
            if (found)
                field = found;
        });
        if (!field)
            throw new Error("type `".concat(type.name, "` does not have a field `").concat(f, "`"));
        current = field;
    });
    return current;
}
exports.getFieldFromPath = getFieldFromPath;
//# sourceMappingURL=getFieldFromPath.js.map