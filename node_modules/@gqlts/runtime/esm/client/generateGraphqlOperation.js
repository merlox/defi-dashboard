import { __read, __spreadArray } from "tslib";
import { getFieldFromPath } from "./getFieldFromPath";
function parseRequest(request, ctx, path) {
    if (Array.isArray(request)) {
        var _a = __read(request, 2), args_1 = _a[0], fields = _a[1];
        var argNames = Object.keys(args_1);
        if (argNames.length === 0) {
            return parseRequest(fields, ctx, path);
        }
        var field_1 = getFieldFromPath(ctx.root, path);
        return "(".concat(argNames.map(function (argName) {
            ctx.varCounter++;
            var varName = "v".concat(ctx.varCounter);
            var typing = field_1.args && field_1.args[argName]; // typeMap used here, .args
            if (!typing) {
                throw new Error("no typing defined for argument `".concat(argName, "` in path `").concat(path.join("."), "`"));
            }
            ctx.variables[varName] = {
                value: args_1[argName],
                typing: typing,
            };
            return "".concat(argName, ":$").concat(varName);
        }), ")").concat(parseRequest(fields, ctx, path));
    }
    else if (typeof request === "object") {
        var fields_1 = request;
        var fieldNames = Object.keys(fields_1).filter(function (k) { return Boolean(fields_1[k]); });
        if (fieldNames.length === 0) {
            // TODO if fields are empty just return?
            throw new Error("field selection should not be empty");
        }
        var type = path.length > 0 ? getFieldFromPath(ctx.root, path).type : ctx.root;
        var scalarFields = type.scalar;
        var scalarFieldsFragment = void 0;
        if (fieldNames.includes("__scalar")) {
            var falsyFieldNames_1 = new Set(Object.keys(fields_1).filter(function (k) { return !Boolean(fields_1[k]); }));
            if (scalarFields === null || scalarFields === void 0 ? void 0 : scalarFields.length) {
                ctx.fragmentCounter++;
                scalarFieldsFragment = "f".concat(ctx.fragmentCounter);
                ctx.fragments.push("fragment ".concat(scalarFieldsFragment, " on ").concat(type.name, "{").concat(scalarFields
                    .filter(function (f) { return !falsyFieldNames_1.has(f); })
                    .join(","), "}"));
            }
        }
        var fieldsSelection = fieldNames
            .filter(function (f) { return !["__scalar", "__name"].includes(f); })
            .map(function (f) {
            var parsed = parseRequest(fields_1[f], ctx, __spreadArray(__spreadArray([], __read(path), false), [f], false));
            if (f.startsWith("on_")) {
                ctx.fragmentCounter++;
                var implementationFragment = "f".concat(ctx.fragmentCounter);
                var typeMatch = f.match(/^on_(.+)/);
                if (!typeMatch || !typeMatch[1])
                    throw new Error("match failed");
                ctx.fragments.push("fragment ".concat(implementationFragment, " on ").concat(typeMatch[1]).concat(parsed));
                return "...".concat(implementationFragment);
            }
            else {
                return "".concat(f).concat(parsed);
            }
        })
            .concat(scalarFieldsFragment ? ["...".concat(scalarFieldsFragment)] : [])
            .join(",");
        return "{".concat(fieldsSelection, "}");
    }
    else {
        return "";
    }
}
export function generateGraphqlOperation(operation, root, fields) {
    var ctx = {
        root: root,
        varCounter: 0,
        variables: {},
        fragmentCounter: 0,
        fragments: [],
    };
    var result = parseRequest(fields, ctx, []);
    var varNames = Object.keys(ctx.variables);
    var varsString = varNames.length > 0
        ? "(".concat(varNames.map(function (v) {
            var variableType = ctx.variables[v].typing[1];
            //   console.log('variableType', variableType)
            return "$".concat(v, ":").concat(variableType);
        }), ")")
        : "";
    var operationName = (fields === null || fields === void 0 ? void 0 : fields.__name) || "";
    return {
        query: __spreadArray(["".concat(operation, " ").concat(operationName).concat(varsString).concat(result)], __read(ctx.fragments), false).join(","),
        variables: Object.keys(ctx.variables).reduce(function (r, v) {
            r[v] = ctx.variables[v].value;
            return r;
        }, {}),
    };
}
//# sourceMappingURL=generateGraphqlOperation.js.map