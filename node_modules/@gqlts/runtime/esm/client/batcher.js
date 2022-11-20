/**
 * takes a list of requests (queue) and batches them into a single server request.
 * It will then resolve each individual requests promise with the appropriate data.
 * @private
 * @param {QueryBatcher}   client - the client to use
 * @param {Queue} queue  - the list of requests to batch
 * @param {AxiosRequestConfig} config  - AxiosRequestConfig
 */
function dispatchQueueBatch(client, queue, config) {
    var batchedQuery = queue.map(function (item) { return item.request; });
    if (batchedQuery.length === 1) {
        // @ts-ignore
        batchedQuery = batchedQuery[0];
    }
    client.fetcher(batchedQuery, config).then(function (responses) {
        if (queue.length === 1 && !Array.isArray(responses)) {
            // @ts-ignore
            if (responses.errors && responses.errors.length) {
                queue[0].reject(responses);
                return;
            }
            queue[0].resolve(responses);
            return;
        }
        else if (responses.length !== queue.length) {
            throw new Error("response length did not match query length");
        }
        for (var i = 0; i < queue.length; i++) {
            if (responses[i].errors && responses[i].errors.length) {
                queue[i].reject(responses[i]);
            }
            else {
                queue[i].resolve(responses[i]);
            }
        }
    });
}
/**
 * creates a list of requests to batch according to max batch size.
 * @private
 * @param {QueryBatcher} client - the client to create list of requests from from
 * @param {Options} options - the options for the batch
 * @param {AxiosRequestConfig} config - AxiosRequestConfig
 */
function dispatchQueue(client, options, config) {
    var queue = client._queue;
    var maxBatchSize = options.maxBatchSize || 0;
    client._queue = [];
    if (maxBatchSize > 0 && maxBatchSize < queue.length) {
        for (var i = 0; i < queue.length / maxBatchSize; i++) {
            dispatchQueueBatch(client, queue.slice(i * maxBatchSize, (i + 1) * maxBatchSize), config);
        }
    }
    else {
        dispatchQueueBatch(client, queue, config);
    }
}
/**
 * Create a batcher client.
 * @param {Fetcher} fetcher                 - A function that can handle the network requests to graphql endpoint
 * @param {Options} options                 - the options to be used by client
 * @param {boolean} options.shouldBatch     - should the client batch requests. (default true)
 * @param {number} options.batchInterval   - duration (in MS) of each batch window. (default 6)
 * @param {number} options.maxBatchSize    - max number of requests in a batch. (default 0)
 * @param {boolean} options.defaultHeaders  - default headers to include with every request
 *
 * @example
 * const fetcher = batchedQuery => fetch('path/to/graphql', {
 *    method: 'post',
 *    headers: {
 *      Accept: 'application/json',
 *      'Content-Type': 'application/json',
 *    },
 *    body: JSON.stringify(batchedQuery),
 *    credentials: 'include',
 * })
 * .then(response => response.json())
 *
 * const client = new QueryBatcher(fetcher, { maxBatchSize: 10 })
 */
var QueryBatcher = /** @class */ (function () {
    function QueryBatcher(fetcher, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.batchInterval, batchInterval = _c === void 0 ? 6 : _c, _d = _b.shouldBatch, shouldBatch = _d === void 0 ? true : _d, _e = _b.maxBatchSize, maxBatchSize = _e === void 0 ? 0 : _e;
        this.fetcher = fetcher;
        this._options = {
            batchInterval: batchInterval,
            shouldBatch: shouldBatch,
            maxBatchSize: maxBatchSize,
        };
        this._queue = [];
    }
    /**
     * Fetch will send a graphql request and return the parsed json.
     * @param {string}      query          - the graphql query.
     * @param {Variables}   variables      - any variables you wish to inject as key/value pairs.
     * @param {[string]}    operationName  - the graphql operationName.
     * @param {Options}     overrides      - the client options overrides.
     *
     * @param config
     * @return {promise} resolves to parsed json of server response
     *
     * @example
     * client.fetch(`
     *    query getHuman($id: ID!) {
     *      human(id: $id) {
     *        name
     *        height
     *      }
     *    }
     * `, { id: "1001" }, 'getHuman')
     *    .then(human => {
     *      // do something with human
     *      console.log(human);
     *    });
     */
    QueryBatcher.prototype.fetch = function (_a) {
        var _this = this;
        var query = _a.query, variables = _a.variables, operationName = _a.operationName, _b = _a.overrides, overrides = _b === void 0 ? {} : _b, _c = _a.config, config = _c === void 0 ? {} : _c;
        var request = {
            query: query,
        };
        var options = Object.assign({}, this._options, overrides);
        if (variables) {
            request.variables = variables;
        }
        if (operationName) {
            request.operationName = operationName;
        }
        return new Promise(function (resolve, reject) {
            _this._queue.push({
                request: request,
                resolve: resolve,
                reject: reject,
            });
            if (_this._queue.length === 1) {
                if (options.shouldBatch) {
                    setTimeout(function () { return dispatchQueue(_this, options, config); }, options.batchInterval);
                }
                else {
                    dispatchQueue(_this, options, config);
                }
            }
        });
    };
    /**
     * Fetch will send a graphql request and return the parsed json.
     * @param {string}      query          - the graphql query.
     * @param {Variables}   variables      - any variables you wish to inject as key/value pairs.
     * @param {[string]}    operationName  - the graphql operationName.
     * @param {Options}     overrides      - the client options overrides.
     *
     * @return {Promise<Array<Result>>} resolves to parsed json of server response
     *
     * @example
     * client.forceFetch(`
     *    query getHuman($id: ID!) {
     *      human(id: $id) {
     *        name
     *        height
     *      }
     *    }
     * `, { id: "1001" }, 'getHuman')
     *    .then(human => {
     *      // do something with human
     *      console.log(human);
     *    });
     */
    QueryBatcher.prototype.forceFetch = function (query, variables, operationName, overrides) {
        var _this = this;
        if (overrides === void 0) { overrides = {}; }
        var request = {
            query: query,
        };
        var options = Object.assign({}, this._options, overrides, {
            shouldBatch: false,
        });
        if (variables) {
            request.variables = variables;
        }
        if (operationName) {
            request.operationName = operationName;
        }
        return new Promise(function (resolve, reject) {
            var client = new QueryBatcher(_this.fetcher, _this._options);
            client._queue = [
                {
                    request: request,
                    resolve: resolve,
                    reject: reject,
                },
            ];
            dispatchQueue(client, options);
        });
    };
    return QueryBatcher;
}());
export { QueryBatcher };
//# sourceMappingURL=batcher.js.map