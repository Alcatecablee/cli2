export interface NeuroLintConfig {
    version: string;
    layers: {
        enabled: number[];
        config: Record<number, {
            name: string;
            timeout: number;
            enabled?: boolean;
        }>;
    };
    files: {
        include: string[];
        exclude: string[];
    };
    output: {
        format: "table" | "json" | "summary";
        verbose: boolean;
    };
    api: {
        url: string;
        timeout: number;
    };
    apiKey?: string;
}
export declare function loadConfig(configPath?: string): Promise<NeuroLintConfig>;
export declare function saveConfig(config: Partial<NeuroLintConfig>, configPath?: string): Promise<void>;
export declare function validateConfig(config: NeuroLintConfig): Promise<{
    valid: boolean;
    errors: string[];
}>;
export declare function getConfigPath(): Promise<string | null>;
