import { CompressedTypeMap, LinkedArgMap, LinkedTypeMap } from "../types";
export interface PartialLinkedFieldMap {
    [field: string]: {
        type: string;
        args?: LinkedArgMap;
    };
}
export declare function linkTypeMap(typeMap: CompressedTypeMap<number>): LinkedTypeMap;
export declare const resolveConcreteTypes: (linkedTypeMap: LinkedTypeMap) => LinkedTypeMap;
//# sourceMappingURL=linkTypeMap.d.ts.map