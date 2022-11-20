import { __assign, __awaiter, __generator, __read, __rest, __values } from "tslib";
import { extractFiles } from "./extract-files/extract-files";
import { QueryBatcher } from "./client/batcher";
import axios from "axios";
import FormData from "form-data";
var DEFAULT_BATCH_OPTIONS = {
    maxBatchSize: 10,
    batchInterval: 40,
};
export function createFetcher(params) {
    var _this = this;
    var _a = params.url, url = _a === void 0 ? "" : _a, _b = params.timeout, timeout = _b === void 0 ? 100000 : _b, _c = params.headers, headers = _c === void 0 ? {} : _c, _d = params.batch, batch = _d === void 0 ? false : _d, rest = __rest(params, ["url", "timeout", "headers", "batch"]);
    var fetcherMethod = params.fetcherMethod, fetcherInstance = params.fetcherInstance;
    if (!url && !fetcherMethod) {
        throw new Error("url or fetcher is required");
    }
    if (!fetcherInstance) {
        fetcherInstance = axios.create({});
    }
    if (!fetcherMethod) {
        fetcherMethod = function (body, config) { return __awaiter(_this, void 0, void 0, function () {
            var _a, clone, files, formData, map_1, i_1, j, files_1, files_1_1, _b, file, headersObject, _c, _d, fetchBody;
            var e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = extractFiles(body), clone = _a.clone, files = _a.files;
                        formData = undefined;
                        if (files.size > 0) {
                            formData = new FormData();
                            // 1. First document is graphql query with variables
                            formData.append("operations", JSON.stringify(clone));
                            map_1 = {};
                            i_1 = 0;
                            files.forEach(function (paths) {
                                map_1[i_1++] = paths;
                            });
                            formData.append("map", JSON.stringify(map_1));
                            j = 0;
                            try {
                                for (files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                                    _b = __read(files_1_1.value, 1), file = _b[0];
                                    formData.append("".concat(j++), file, file.name);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (files_1_1 && !files_1_1.done && (_e = files_1.return)) _e.call(files_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                        _c = [{ "Content-Type": "application/json" }];
                        if (!(typeof headers == "function")) return [3 /*break*/, 2];
                        return [4 /*yield*/, headers()];
                    case 1:
                        _d = _f.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _d = headers;
                        _f.label = 3;
                    case 3:
                        headersObject = __assign.apply(void 0, [__assign.apply(void 0, _c.concat([(_d)])), (!!(formData === null || formData === void 0 ? void 0 : formData.getHeaders) && (formData === null || formData === void 0 ? void 0 : formData.getHeaders()))]);
                        fetchBody = files.size && formData ? formData : JSON.stringify(body);
                        return [2 /*return*/, fetcherInstance(__assign(__assign({ url: url, data: fetchBody, method: "POST", headers: headersObject, timeout: timeout, withCredentials: true }, rest), config))
                                .then(function (res) {
                                if (res.status === 200) {
                                    return res.data;
                                }
                                return {
                                    data: null,
                                    errors: [{ message: res.statusText, code: res.status, path: ["clientResponseNotOk"] }],
                                };
                            })
                                .catch(function (err) {
                                return { data: null, errors: [{ message: err.message, code: err.code, path: ["clientResponseError"] }] };
                            })];
                }
            });
        }); };
    }
    if (!batch) {
        return {
            fetcherMethod: function (body, config) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!fetcherMethod) {
                        throw new Error("fetcher is required");
                    }
                    return [2 /*return*/, fetcherMethod(body, config)];
                });
            }); },
            fetcherInstance: fetcherInstance,
        };
    }
    // todo test batcher
    var batcher = new QueryBatcher(function (batchedQuery, config) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // console.log(batchedQuery) // [{ query: 'query{user{age}}', variables: {} }, ...]
            if (!fetcherMethod) {
                throw new Error("fetcher is not defined");
            }
            return [2 /*return*/, fetcherMethod(batchedQuery, config)];
        });
    }); }, batch === true ? DEFAULT_BATCH_OPTIONS : batch);
    return {
        fetcherMethod: function (_a, config) {
            var query = _a.query, variables = _a.variables;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    return [2 /*return*/, batcher.fetch({ query: query, variables: variables, config: config })];
                });
            });
        },
        fetcherInstance: fetcherInstance,
    };
}
//# sourceMappingURL=fetcher.js.map