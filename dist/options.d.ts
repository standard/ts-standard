import * as eslint from 'eslint';
export interface Options {
    cmd: string;
    version: string;
    homepage: string;
    bugs: string;
    tagline: string;
    eslint: any;
    eslintConfig: eslint.CLIEngine.Options;
}
export declare function getOptions(): Promise<Options>;
