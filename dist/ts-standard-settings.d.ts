import * as pkgConf from 'pkg-conf';
declare type EslintBuiltInFormatters = 'stylish' | 'checkstyle' | 'codeframe' | 'compact' | 'html' | 'jslint-xml' | 'json' | 'junit' | 'table' | 'tap' | 'unix' | 'visualstudio';
export interface TSStandardSettings extends pkgConf.Config {
    ignore?: string[];
    noDefaultIgnore?: boolean;
    global?: string[];
    globals?: string[];
    plugin?: string[];
    plugins?: string[];
    env?: string[];
    envs?: string[];
    parser?: string;
    project?: string;
    formatter: string | EslintBuiltInFormatters;
    fix?: boolean;
}
export declare const DEFAULT_TSCONFIG_LOCATIONS: string[];
export declare function getTSStandardSettings(): Promise<TSStandardSettings>;
export declare function _resolveTSConfigPath(settingsProjectPath?: string): string | undefined;
export declare function _getTSConfigFromDefaultLocations(): string | undefined;
export declare function _isValidPath(pathToValidate: string): boolean;
export {};
