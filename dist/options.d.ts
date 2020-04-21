import * as eslint from 'eslint';
import { TSStandardSettings } from './ts-standard-settings';
export interface Options {
    cmd: string;
    version: string;
    homepage: string;
    bugs: string;
    tagline: string;
    eslint: any;
    eslintConfig: eslint.CLIEngine.Options;
    formatter: TSStandardSettings['formatter'];
    fix: TSStandardSettings['fix'];
}
export declare function getOptions(): Promise<Options>;
