import { AxiosRequestConfig } from "axios";
declare type Variables = Record<string, any>;
declare type Query = {
    query: string;
    variables?: Variables;
    operationName?: string;
};
declare type QueryError = {
    name: string;
    message: string;
    locations?: {
        line: number;
        column: number;
    }[];
    path?: any;
    rid: string;
    details?: Record<string, any>;
};
declare type Result = {
    data: Record<string, any>;
    errors: QueryError[];
};
declare type Fetcher = (batchedQuery: Query[] | Query, config?: AxiosRequestConfig) => Promise<Result[]>;
declare type Options = {
    batchInterval?: number;
    shouldBatch?: boolean;
    maxBatchSize?: number;
};
declare type Queue = {
    request: Query;
    resolve: (...args: any[]) => any;
    reject: (...args: any[]) => any;
}[];
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
export declare class QueryBatcher {
    fetcher: Fetcher;
    _options: Options;
    _queue: Queue;
    constructor(fetcher: Fetcher, { batchInterval, shouldBatch, maxBatchSize }?: Options);
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
    fetch({ query, variables, operationName, overrides, config, }: {
        query: string;
        variables?: Variables;
        operationName?: string;
        overrides?: Options;
        config?: AxiosRequestConfig;
    }): Promise<Result[]>;
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
    forceFetch(query: string, variables?: Variables, operationName?: string, overrides?: Options): Promise<Result[]>;
}
export {};
//# sourceMappingURL=batcher.d.ts.map