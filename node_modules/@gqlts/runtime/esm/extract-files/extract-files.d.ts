export declare class ReactNativeFile {
    uri: string;
    name?: string;
    type?: string;
    constructor(uri: string, name?: string, type?: string);
}
export declare function isExtractableFile(value: any): boolean;
export declare function extractFiles(value: any, path?: string, isExtractableFileMethod?: typeof isExtractableFile): {
    clone: any;
    files: Map<any, any>;
};
//# sourceMappingURL=extract-files.d.ts.map