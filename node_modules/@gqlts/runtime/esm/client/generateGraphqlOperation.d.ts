import { LinkedType } from "../types";
export interface Args {
    [arg: string]: any | undefined;
}
export interface Fields {
    [field: string]: Request;
}
export declare type Request = boolean | number | Fields | [Args, Fields?];
export interface Variables {
    [name: string]: {
        value: any;
        typing: [LinkedType, string];
    };
}
export interface Context {
    root: LinkedType;
    varCounter: number;
    variables: Variables;
    fragmentCounter: number;
    fragments: string[];
}
export interface GraphqlOperation {
    query: string;
    variables: {
        [name: string]: any;
    };
}
export declare function generateGraphqlOperation(operation: "query" | "mutation" | "subscription", root: LinkedType, fields: Fields): GraphqlOperation;
//# sourceMappingURL=generateGraphqlOperation.d.ts.map