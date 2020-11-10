export interface CLIOptions {
    fix: boolean;
    useStdIn: boolean;
    stdInFilename?: string;
    files?: string[];
    project?: string;
    globals?: string[];
    plugins?: string[];
    envs?: string[];
    parser?: string;
    report?: string;
    extensions?: string[];
}
export declare function getCLIOptions(): CLIOptions;
export declare function _convertToArray(val?: string | string[]): string[] | undefined;
