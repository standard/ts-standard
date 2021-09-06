export declare const DEFAULT_TSCONFIG_LOCATIONS: string[];
export declare const DEFAULT_EXTENSIONS: string[];
export interface DefaultOptions {
    files: string[];
    fix: boolean;
    report: string;
    useStdIn: boolean;
    noDefaultIgnore: boolean;
    eslint: undefined;
    cwd: string;
    stdInFilename?: string;
    project?: string | string[];
    ignore?: string[];
    envs?: string[];
    globals?: string[];
    plugins?: string[];
    parser?: string;
    extensions?: string[];
}
export declare function getDefaultOptions(cwd?: string): DefaultOptions;
export declare function _getTSConfigFromDefaultLocations(cwd: string): string | undefined;
export declare function _isValidPath(pathToValidate: string): boolean;
