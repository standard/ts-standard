interface PackageOptions {
    files?: string[];
    project?: string | string[];
    fix?: boolean;
    report?: string;
    ignore?: string[];
    noDefaultIgnore?: boolean;
    globals?: string[];
    plugins?: string[];
    envs?: string[];
    parser?: string;
    eslint?: string;
    cwd?: string;
    extensions?: string[];
}
export declare function getPackageOptions(cwd?: string): PackageOptions;
export declare function _resolveTSConfigPath(cwd: string, settingsProjectPath?: string | string[]): string | string[] | undefined;
export {};
