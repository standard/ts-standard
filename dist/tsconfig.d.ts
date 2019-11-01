export declare const DEFAULT_TSCONFIG_LOCATIONS: string[];
export declare class TSConfig {
    private readonly cwd;
    constructor();
    getConfigFilePath(): string | undefined;
    _getTSConfigPathFromSettings(): string | undefined;
    _getTSConfigFromDefaultLocations(): string | undefined;
    _isValidPath(pathToValidate: string): boolean;
}
