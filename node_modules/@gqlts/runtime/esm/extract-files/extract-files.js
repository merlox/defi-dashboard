import { __values } from "tslib";
var fs = typeof window !== "undefined" ? null : eval('require("node:fs")');
var ReadStream = fs ? fs.ReadStream : null;
var ReactNativeFile = /** @class */ (function () {
    function ReactNativeFile(uri, name, type) {
        this.uri = uri;
        this.name = name;
        this.type = type;
    }
    return ReactNativeFile;
}());
export { ReactNativeFile };
export function isExtractableFile(value) {
    return ((typeof File !== "undefined" && value instanceof File) ||
        (typeof Blob !== "undefined" && value instanceof Blob) ||
        (ReadStream && typeof ReadStream !== "undefined" && value instanceof ReadStream) ||
        value instanceof ReactNativeFile);
}
export function extractFiles(value, path, isExtractableFileMethod) {
    if (path === void 0) { path = ""; }
    if (isExtractableFileMethod === void 0) { isExtractableFileMethod = isExtractableFile; }
    // Map of extracted files and their object paths within the input value.
    var files = new Map();
    // Map of arrays and objects recursive within the input value and their clones,
    // for reusing clones of values that are referenced multiple times within the
    // input value.
    var clones = new Map();
    /**
     * Recursively clones the value, extracting files.
     * @kind function
     * @name extractFiles~recurse
     * @param {*} value Value to extract files from.
     * @param {ObjectPath} path Prefix for object paths for extracted files.
     * @param {Set} recursive Recursive arrays and objects for avoiding infinite recursion of circular references within the input value.
     * @returns {*} Clone of the value with files replaced with `null`.
     * @ignore
     */
    function recurse(value, path, recursive) {
        var e_1, _a;
        var clone = value;
        if (isExtractableFileMethod(value)) {
            clone = null;
            var filePaths = files.get(value);
            filePaths ? filePaths.push(path) : files.set(value, [path]);
        }
        else {
            var isList = Array.isArray(value) || (typeof FileList !== "undefined" && value instanceof FileList);
            var isObject = value && value.constructor === Object;
            if (isList || isObject) {
                var hasClone = clones.has(value);
                if (hasClone)
                    clone = clones.get(value);
                else {
                    clone = isList ? [] : {};
                    clones.set(value, clone);
                }
                if (!recursive.has(value)) {
                    var pathPrefix = path ? "".concat(path, ".") : "";
                    var recursiveDeeper = new Set(recursive).add(value);
                    if (isList) {
                        var index = 0;
                        try {
                            // @ts-ignore
                            for (var value_1 = __values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                                var item = value_1_1.value;
                                var itemClone = recurse(item, pathPrefix + index++, recursiveDeeper);
                                if (!hasClone)
                                    clone.push(itemClone);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    else
                        for (var key in value) {
                            var propertyClone = recurse(value[key], pathPrefix + key, recursiveDeeper);
                            if (!hasClone)
                                clone[key] = propertyClone;
                        }
                }
            }
        }
        return clone;
    }
    return {
        clone: recurse(value, path, new Set()),
        files: files,
    };
}
//# sourceMappingURL=extract-files.js.map