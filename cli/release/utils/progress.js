"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTracker = void 0;
exports.resumeOperation = resumeOperation;
exports.createBatchProcessor = createBatchProcessor;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
class ProgressTracker {
    constructor(operation, files, autoSave = true) {
        this.autoSave = autoSave;
        this.state = {
            id: `${operation}-${Date.now()}`,
            operation,
            total: files.length,
            completed: 0,
            failed: 0,
            startTime: Date.now(),
            lastUpdate: Date.now(),
            files: {
                completed: [],
                failed: [],
                remaining: [...files],
            },
        };
        this.stateFile = path_1.default.join(process.cwd(), ".neurolint-progress.json");
    }
    async start() {
        if (this.autoSave) {
            await this.saveState();
        }
        this.spinner = (0, ora_1.default)({
            text: this.getSpinnerText(),
            color: "blue",
        }).start();
    }
    async markCompleted(file) {
        const index = this.state.files.remaining.indexOf(file);
        if (index !== -1) {
            this.state.files.remaining.splice(index, 1);
            this.state.files.completed.push(file);
            this.state.completed++;
            this.state.lastUpdate = Date.now();
            if (this.spinner) {
                this.spinner.text = this.getSpinnerText();
            }
            if (this.autoSave) {
                await this.saveState();
            }
        }
    }
    async markFailed(file, error) {
        const index = this.state.files.remaining.indexOf(file);
        if (index !== -1) {
            this.state.files.remaining.splice(index, 1);
            this.state.files.failed.push(file);
            this.state.failed++;
            this.state.lastUpdate = Date.now();
            if (this.spinner) {
                this.spinner.text = this.getSpinnerText();
            }
            if (this.autoSave) {
                await this.saveState();
            }
        }
    }
    async complete(success = true) {
        if (this.spinner) {
            if (success) {
                this.spinner.succeed(this.getCompletionMessage());
            }
            else {
                this.spinner.fail(this.getCompletionMessage());
            }
        }
        if (this.autoSave) {
            await this.cleanup();
        }
    }
    async saveState() {
        try {
            await fs_extra_1.default.writeJson(this.stateFile, this.state, { spaces: 2 });
        }
        catch (error) {
            // Ignore save errors to not interrupt the main operation
        }
    }
    async loadState() {
        try {
            if (await fs_extra_1.default.pathExists(this.stateFile)) {
                return await fs_extra_1.default.readJson(this.stateFile);
            }
        }
        catch (error) {
            // Ignore load errors
        }
        return null;
    }
    async cleanup() {
        try {
            if (await fs_extra_1.default.pathExists(this.stateFile)) {
                await fs_extra_1.default.remove(this.stateFile);
            }
        }
        catch (error) {
            // Ignore cleanup errors
        }
    }
    getProgress() {
        const processed = this.state.completed + this.state.failed;
        const percentage = this.state.total > 0 ? (processed / this.state.total) * 100 : 0;
        const elapsed = Date.now() - this.state.startTime;
        const rate = processed / (elapsed / 1000); // files per second
        const remaining = this.state.total - processed;
        const eta = rate > 0 ? (remaining / rate) * 1000 : 0; // milliseconds
        return {
            percentage: Math.round(percentage * 100) / 100,
            eta: formatDuration(eta),
        };
    }
    getSpinnerText() {
        const { percentage, eta } = this.getProgress();
        const processed = this.state.completed + this.state.failed;
        let text = `${this.state.operation} (${processed}/${this.state.total}) ${percentage.toFixed(1)}%`;
        if (eta !== "0s" && processed > 0) {
            text += ` - ETA: ${eta}`;
        }
        if (this.state.failed > 0) {
            text += chalk_1.default.red(` - ${this.state.failed} failed`);
        }
        return text;
    }
    getCompletionMessage() {
        const duration = formatDuration(Date.now() - this.state.startTime);
        let message = `${this.state.operation} completed in ${duration}`;
        if (this.state.failed > 0) {
            message += chalk_1.default.red(` (${this.state.failed} failed)`);
        }
        return message;
    }
    // Getters for accessing state
    get totalFiles() {
        return this.state.total;
    }
    get completedFiles() {
        return this.state.completed;
    }
    get failedFiles() {
        return this.state.failed;
    }
    get remainingFiles() {
        return [...this.state.files.remaining];
    }
    get completedFilesList() {
        return [...this.state.files.completed];
    }
    get failedFilesList() {
        return [...this.state.files.failed];
    }
}
exports.ProgressTracker = ProgressTracker;
async function resumeOperation(operationName) {
    const stateFile = path_1.default.join(process.cwd(), ".neurolint-progress.json");
    try {
        if (await fs_extra_1.default.pathExists(stateFile)) {
            const state = await fs_extra_1.default.readJson(stateFile);
            if (state.operation === operationName &&
                state.files.remaining.length > 0) {
                console.log(chalk_1.default.white(`\nFound incomplete ${operationName} operation`));
                console.log(chalk_1.default.gray(`   Started: ${new Date(state.startTime).toLocaleString()}`));
                console.log(chalk_1.default.gray(`   Progress: ${state.completed}/${state.total} completed, ${state.failed} failed`));
                console.log(chalk_1.default.gray(`   Remaining: ${state.files.remaining.length} files\n`));
                return state;
            }
        }
    }
    catch (error) {
        // Ignore errors and start fresh
    }
    return null;
}
function formatDuration(ms) {
    if (ms < 1000)
        return "0s";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    else {
        return `${seconds}s`;
    }
}
function createBatchProcessor(items, processor, options = {}) {
    const { batchSize = 10, concurrency = 3, onProgress } = options;
    return {
        async process() {
            let completed = 0;
            let failed = 0;
            // Process items in batches with limited concurrency
            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);
                // Limit concurrency within batch
                const semaphore = new Semaphore(concurrency);
                await Promise.all(batch.map(async (item) => {
                    await semaphore.acquire();
                    try {
                        await processor(item);
                        completed++;
                    }
                    catch (error) {
                        failed++;
                    }
                    finally {
                        semaphore.release();
                        if (onProgress) {
                            onProgress(completed + failed, items.length);
                        }
                    }
                }));
            }
            return { completed, failed };
        },
    };
}
class Semaphore {
    constructor(permits) {
        this.waiting = [];
        this.permits = permits;
    }
    async acquire() {
        if (this.permits > 0) {
            this.permits--;
            return;
        }
        return new Promise((resolve) => {
            this.waiting.push(resolve);
        });
    }
    release() {
        if (this.waiting.length > 0) {
            const resolve = this.waiting.shift();
            resolve();
        }
        else {
            this.permits++;
        }
    }
}
