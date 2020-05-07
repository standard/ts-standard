export declare const CMD = "ts-standard";
export declare const TAGLINE = "Typescript Standard Style!";
export interface CLIOptions {
    fix: boolean;
    useStdIn: boolean;
    files?: string[];
    project?: string;
    globals?: string[];
    plugins?: string[];
    envs?: string[];
    parser?: string;
    report?: string;
}
export declare function getCLIOptions(): CLIOptions;
export declare function _convertToArray<T>(val?: T | T[]): T[] | undefined;
