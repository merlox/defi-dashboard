export { createClient } from "./client/createClient";
export { generateGraphqlOperation } from "./client/generateGraphqlOperation";
export { linkTypeMap } from "./client/linkTypeMap";
export { Observable } from "zen-observable-ts";
export { createFetcher } from "./fetcher";
export { ClientError } from "./error";
export var everything = {
    __scalar: true,
};
export function assertSameVersion(generatedWithVersion) {
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
//
//# sourceMappingURL=index.js.map