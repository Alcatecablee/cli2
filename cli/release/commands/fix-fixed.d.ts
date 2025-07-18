interface FixOptions {
    layers?: string;
    recursive?: boolean;
    dryRun?: boolean;
    backup?: boolean;
    include?: string;
    exclude?: string;
    config?: string;
}
export declare function fixCommand(files: string[], options: FixOptions): Promise<void>;
export {};
