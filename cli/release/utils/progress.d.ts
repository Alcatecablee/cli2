export interface ProgressState {
    id: string;
    operation: string;
    total: number;
    completed: number;
    failed: number;
    startTime: number;
    lastUpdate: number;
    files: {
        completed: string[];
        failed: string[];
        remaining: string[];
    };
}
export declare class ProgressTracker {
    private state;
    private stateFile;
    private spinner?;
    private autoSave;
    constructor(operation: string, files: string[], autoSave?: boolean);
    start(): Promise<void>;
    markCompleted(file: string): Promise<void>;
    markFailed(file: string, error?: string): Promise<void>;
    complete(success?: boolean): Promise<void>;
    saveState(): Promise<void>;
    loadState(): Promise<ProgressState | null>;
    cleanup(): Promise<void>;
    getProgress(): {
        percentage: number;
        eta: string;
    };
    private getSpinnerText;
    private getCompletionMessage;
    get totalFiles(): number;
    get completedFiles(): number;
    get failedFiles(): number;
    get remainingFiles(): string[];
    get completedFilesList(): string[];
    get failedFilesList(): string[];
}
export declare function resumeOperation(operationName: string): Promise<ProgressState | null>;
export declare function createBatchProcessor<T>(items: T[], processor: (item: T) => Promise<void>, options?: {
    batchSize?: number;
    concurrency?: number;
    onProgress?: (completed: number, total: number) => void;
}): {
    process(): Promise<{
        completed: number;
        failed: number;
    }>;
};
