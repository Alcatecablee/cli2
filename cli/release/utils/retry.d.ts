export interface RetryOptions {
    maxAttempts?: number;
    delay?: number;
    backoffFactor?: number;
    maxDelay?: number;
    retryCondition?: (error: any) => boolean;
    onRetry?: (error: any, attempt: number) => void;
}
export declare function withRetry<T>(operation: () => Promise<T>, options?: RetryOptions): Promise<T>;
export declare function isRetryableError(error: any): boolean;
export declare function sleep(ms: number): Promise<void>;
export declare class RetryableOperation<T> {
    private options;
    constructor(options?: RetryOptions);
    execute(operation: () => Promise<T>): Promise<T>;
    onRetry(callback: (error: any, attempt: number) => void): this;
    withCondition(condition: (error: any) => boolean): this;
    withDelay(delay: number): this;
    withMaxAttempts(maxAttempts: number): this;
}
export declare function createRetryableApiCall(baseUrl: string, timeout?: number): RetryableOperation<unknown>;
