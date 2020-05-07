import type { LintResult } from 'standard-engine';
export declare function standardReporter(isUsingStdInAndFix: boolean): (results: LintResult[]) => string;
