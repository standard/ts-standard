import { TSStandardLintOptions, LintCallBack } from './ts-standard';
export interface ParseOptions {
    cwd?: string;
    filename?: string;
}
export declare function parseOpts(options: ParseOptions): ParseOptions;
export declare function lintText(text: string, options: LintCallBack): void;
export declare function lintText(text: string, options: TSStandardLintOptions & ParseOptions, callback: LintCallBack): void;
export declare function lintFiles(files: string[], options: LintCallBack): void;
export declare function lintFiles(files: string[], options: TSStandardLintOptions & ParseOptions, callback: LintCallBack): void;
