declare type Impossible<K extends keyof any> = {
    [P in K]: never;
};
export declare type NoExtraProperties<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>;
export interface ExecutionResult<TData = {
    [key: string]: any;
}> {
    errors?: ReadonlyArray<Error>;
    data?: TData | null;
}
export interface ArgMap<keyType = number> {
    [arg: string]: [keyType, string] | [keyType] | undefined;
}
export declare type CompressedField<keyType = number> = [type: keyType, args?: ArgMap<keyType>];
export interface CompressedFieldMap<keyType = number> {
    [field: string]: CompressedField<keyType> | undefined;
}
export declare type CompressedType<keyType = number> = CompressedFieldMap<keyType>;
export interface CompressedTypeMap<keyType = number> {
    scalars: Array<keyType>;
    types: {
        [type: string]: CompressedType<keyType>;
    };
}
export declare type Field<keyType = number> = {
    type: keyType;
    args?: ArgMap<keyType>;
};
export interface FieldMap<keyType = number> {
    [field: string]: Field<keyType> | undefined;
}
export declare type Type<keyType = number> = FieldMap<keyType>;
export interface TypeMap<keyType = number> {
    scalars: Array<keyType>;
    types: {
        [type: string]: Type<keyType> | undefined;
    };
}
export interface LinkedArgMap {
    [arg: string]: [LinkedType, string] | undefined;
}
export interface LinkedField {
    type: LinkedType;
    args?: LinkedArgMap;
}
export interface LinkedFieldMap {
    [field: string]: LinkedField | undefined;
}
export interface LinkedType {
    name: string;
    fields?: LinkedFieldMap;
    scalar?: string[];
}
export interface LinkedTypeMap {
    [type: string]: LinkedType | undefined;
}
export {};
//# sourceMappingURL=types.d.ts.map