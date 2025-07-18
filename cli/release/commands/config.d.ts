interface ConfigOptions {
    set?: string;
    get?: string;
    list?: boolean;
    reset?: boolean;
}
export declare function configCommand(options: ConfigOptions): Promise<void>;
export {};
