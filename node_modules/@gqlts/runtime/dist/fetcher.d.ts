import { ClientOptions } from "./client/createClient";
import { GraphqlOperation } from "./client/generateGraphqlOperation";
import { AxiosInstance, AxiosRequestConfig } from "axios";
export interface Fetcher {
    fetcherMethod: (gql: GraphqlOperation, config?: AxiosRequestConfig) => Promise<any>;
    fetcherInstance: AxiosInstance | unknown | undefined;
}
export declare type BatchOptions = {
    batchInterval?: number;
    maxBatchSize?: number;
};
export declare function createFetcher(params: ClientOptions): Fetcher;
//# sourceMappingURL=fetcher.d.ts.map