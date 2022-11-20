export declare type FieldsSelection<SRC extends Anify<DST> | undefined, DST> = {
    tuple: DST extends Nil ? never : DST extends readonly [any, infer PAYLOAD] ? FieldsSelection<SRC, PAYLOAD> : never;
    scalar: SRC;
    union: Handle__isUnion<SRC, DST>;
    object: HandleObject<SRC, DST>;
    array: SRC extends Nil ? never : SRC extends (infer T)[] ? Array<FieldsSelection<T, DST>> : never;
    __scalar: Handle__scalar<SRC, DST>;
    never: never;
}[DST extends Nil ? "never" : SRC extends Nil ? "never" : DST extends readonly [any, any] ? "tuple" : DST extends false | 0 ? "never" : SRC extends Scalar ? "scalar" : SRC extends any[] ? "array" : SRC extends {
    __isUnion?: any;
} ? "union" : DST extends {
    __scalar?: any;
} ? "__scalar" : DST extends {} ? "object" : "never"];
declare type HandleObject<SRC extends Anify<DST>, DST> = SRC extends Nil ? never : Pick<{
    [Key in keyof SRC]: Key extends keyof DST ? FieldsSelection<NonNullable<SRC[Key]>, NonNullable<DST[Key]>> : SRC[Key];
}, Exclude<keyof DST, FieldsToRemove>>;
declare type Handle__scalar<SRC extends Anify<DST>, DST> = SRC extends Nil ? never : Pick<{
    [Key in keyof SRC]: Key extends keyof DST ? FieldsSelection<SRC[Key], DST[Key]> : SRC[Key];
}, {
    [Key in keyof SRC]: SRC[Key] extends Nil ? never : Key extends FieldsToRemove ? never : SRC[Key] extends Scalar ? Key : Key extends keyof DST ? Key : never;
}[keyof SRC]>;
declare type Handle__isUnion<SRC extends Anify<DST>, DST> = SRC extends Nil ? never : Omit<SRC, FieldsToRemove>;
declare type Scalar = string | number | Date | boolean | null | undefined;
declare type Anify<T> = {
    [P in keyof T]?: any;
};
declare type FieldsToRemove = "__isUnion" | "__scalar" | "__name";
declare type Nil = undefined | null;
export {};
//# sourceMappingURL=typeSelection.d.ts.map