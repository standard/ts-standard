import * as eslint from 'eslint';
import { LintReport } from 'standard-engine';
export interface Options {
    project?: string;
    fix?: boolean;
    envs?: string[];
    ignore?: string[];
    noDefaultIgnore?: boolean;
    globals?: string[];
    plugins?: string[];
    cwd?: string;
    parser?: string;
    eslint?: string | typeof eslint;
    extensions?: string[];
}
export interface TSStandardLintOptions {
    fix?: boolean;
    globals?: string[];
    plugins?: string[];
    envs?: string[];
    parser?: string;
    cwd?: string;
    filename?: string;
    extensions?: string[];
}
export declare type LintCallBack = (error?: Error, results?: LintReport) => void;
export declare class TSStandard {
    private readonly standardEngine;
    private readonly defaultPerLintOptions;
    constructor(options?: Options);
    lintText(text: string, options?: TSStandardLintOptions & {
        filename?: string;
    }): Promise<LintReport>;
    lintFiles(files: string[], options?: TSStandardLintOptions): Promise<LintReport>;
}
