interface AnalyzeOptions {
    layers?: string;
    output?: string;
    recursive?: boolean;
    include?: string;
    exclude?: string;
    config?: string;
}
export declare function analyzeCommand(files: string[], options: AnalyzeOptions): Promise<void>;
export {};
