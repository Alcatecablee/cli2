export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export interface FileValidationOptions {
    maxFileSize?: number;
    allowedExtensions?: string[];
    minFiles?: number;
    maxFiles?: number;
}
export interface Config {
    apiKey?: string;
    apiUrl?: string;
    [key: string]: any;
}
export declare function validateApiConnection(config: Config): Promise<boolean>;
export declare function validateFiles(patterns: string[], options?: FileValidationOptions): Promise<ValidationResult & {
    files: string[];
}>;
export declare function validateSingleFile(filePath: string, options?: {
    maxFileSize?: number;
    allowedExtensions?: string[];
}): Promise<ValidationResult>;
export declare function validateLayerNumbers(layers: string | number[]): ValidationResult;
export declare function validateOutputFormat(format: string): ValidationResult;
export declare function validateApiUrl(url: string): ValidationResult;
export declare function createFileValidator(options?: FileValidationOptions): {
    validateFiles(patterns: string[]): Promise<ValidationResult & {
        files: string[];
    }>;
    validateSingleFile(filePath: string): Promise<ValidationResult>;
};
