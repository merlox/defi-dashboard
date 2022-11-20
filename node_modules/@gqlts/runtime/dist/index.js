"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSameVersion = exports.everything = exports.ClientError = exports.createFetcher = exports.Observable = exports.linkTypeMap = exports.generateGraphqlOperation = exports.createClient = void 0;
var createClient_1 = require("./client/createClient");
Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return createClient_1.createClient; } });
var generateGraphqlOperation_1 = require("./client/generateGraphqlOperation");
Object.defineProperty(exports, "generateGraphqlOperation", { enumerable: true, get: function () { return generateGraphqlOperation_1.generateGraphqlOperation; } });
var linkTypeMap_1 = require("./client/linkTypeMap");
Object.defineProperty(exports, "linkTypeMap", { enumerable: true, get: function () { return linkTypeMap_1.linkTypeMap; } });
var zen_observable_ts_1 = require("zen-observable-ts");
Object.defineProperty(exports, "Observable", { enumerable: true, get: function () { return zen_observable_ts_1.Observable; } });
var fetcher_1 = require("./fetcher");
Object.defineProperty(exports, "createFetcher", { enumerable: true, get: function () { return fetcher_1.createFetcher; } });
var error_1 = require("./error");
Object.defineProperty(exports, "ClientError", { enumerable: true, get: function () { return error_1.ClientError; } });
exports.everything = {
    __scalar: true,
};
function assertSameVersion(generatedWithVersion) {
    try {
        if (typeof require === "undefined") {
            return;
        }
        var version = require("../package.json").version;
        if (generatedWithVersion && generatedWithVersion.trim() != version.trim()) {
            console.error("[WARNING]: gqlts client library has been generated with a different version of `@gqlts/runtime`, update both packages to have the same version!");
        }
    }
    catch (_a) { }
}
exports.assertSameVersion = assertSameVersion;
//
//# sourceMappingURL=index.js.map