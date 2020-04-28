export declare const DEFAULT_TSCONFIG_LOCATIONS: string[];
export interface DefaultOptions {
    files: string[];
    fix: boolean;
    report: string;
    useStdIn: boolean;
    noDefaultIgnore: boolean;
    eslint: undefined;
    cwd: string;
    project?: string;
    ignore?: string[];
    envs?: string[];
    globals?: string[];
    plugins?: string[];
    parser?: string;
}
export declare function getDefaultOptions(cwd?: string): DefaultOptions;
export declare function _getTSConfigFromDefaultLocations(cwd: string): string | undefined;
export declare function _isValidPath(pathToValidate: string): boolean;
