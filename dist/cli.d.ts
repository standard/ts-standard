import { CLIEngine } from 'eslint';
export interface CLIOptions {
    cmd: string;
    version: string;
    homepage: string;
    bugs: string;
    tagline: string;
    eslint: any;
    eslintConfig: CLIEngine.Options;
}
export declare function CLI(options: CLIOptions): Promise<void>;
