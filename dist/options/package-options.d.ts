interface PackageOptions {
    files?: string[];
    project?: string;
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
}
export declare function getPackageOptions(cwd?: string): PackageOptions;
export declare function _resolveTSConfigPath(cwd: string, settingsProjectPath?: string): string | undefined;
export {};
