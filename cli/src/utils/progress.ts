import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora, { Ora } from "ora";

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

export class ProgressTracker {
  private state: ProgressState;
  private stateFile: string;
  private spinner?: Ora;
  private autoSave: boolean;

  constructor(operation: string, files: string[], autoSave: boolean = true) {
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

    this.stateFile = path.join(process.cwd(), ".neurolint-progress.json");
  }

  async start(): Promise<void> {
    if (this.autoSave) {
      await this.saveState();
    }

    this.spinner = ora({
      text: this.getSpinnerText(),
      color: "blue",
    }).start();
  }

  async markCompleted(file: string): Promise<void> {
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

  async markFailed(file: string, error?: string): Promise<void> {
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

  async complete(success: boolean = true): Promise<void> {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(this.getCompletionMessage());
      } else {
        this.spinner.fail(this.getCompletionMessage());
      }
    }

    if (this.autoSave) {
      await this.cleanup();
    }
  }

  async saveState(): Promise<void> {
    try {
      await fs.writeJson(this.stateFile, this.state, { spaces: 2 });
    } catch (error) {
      // Ignore save errors to not interrupt the main operation
    }
  }

  async loadState(): Promise<ProgressState | null> {
    try {
      if (await fs.pathExists(this.stateFile)) {
        return await fs.readJson(this.stateFile);
      }
    } catch (error) {
      // Ignore load errors
    }
    return null;
  }

  async cleanup(): Promise<void> {
    try {
      if (await fs.pathExists(this.stateFile)) {
        await fs.remove(this.stateFile);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  getProgress(): { percentage: number; eta: string } {
    const processed = this.state.completed + this.state.failed;
    const percentage =
      this.state.total > 0 ? (processed / this.state.total) * 100 : 0;

    const elapsed = Date.now() - this.state.startTime;
    const rate = processed / (elapsed / 1000); // files per second
    const remaining = this.state.total - processed;
    const eta = rate > 0 ? (remaining / rate) * 1000 : 0; // milliseconds

    return {
      percentage: Math.round(percentage * 100) / 100,
      eta: formatDuration(eta),
    };
  }

  private getSpinnerText(): string {
    const { percentage, eta } = this.getProgress();
    const processed = this.state.completed + this.state.failed;

    let text = `${this.state.operation} (${processed}/${this.state.total}) ${percentage.toFixed(1)}%`;

    if (eta !== "0s" && processed > 0) {
      text += ` - ETA: ${eta}`;
    }

    if (this.state.failed > 0) {
      text += chalk.red(` - ${this.state.failed} failed`);
    }

    return text;
  }

  private getCompletionMessage(): string {
    const duration = formatDuration(Date.now() - this.state.startTime);
    let message = `${this.state.operation} completed in ${duration}`;

    if (this.state.failed > 0) {
      message += chalk.red(` (${this.state.failed} failed)`);
    }

    return message;
  }

  // Getters for accessing state
  get totalFiles(): number {
    return this.state.total;
  }
  get completedFiles(): number {
    return this.state.completed;
  }
  get failedFiles(): number {
    return this.state.failed;
  }
  get remainingFiles(): string[] {
    return [...this.state.files.remaining];
  }
  get completedFilesList(): string[] {
    return [...this.state.files.completed];
  }
  get failedFilesList(): string[] {
    return [...this.state.files.failed];
  }
}

export async function resumeOperation(
  operationName: string,
): Promise<ProgressState | null> {
  const stateFile = path.join(process.cwd(), ".neurolint-progress.json");

  try {
    if (await fs.pathExists(stateFile)) {
      const state = await fs.readJson(stateFile);

      if (
        state.operation === operationName &&
        state.files.remaining.length > 0
      ) {
        console.log(
          chalk.white(`\nFound incomplete ${operationName} operation`),
        );
        console.log(
          chalk.gray(
            `   Started: ${new Date(state.startTime).toLocaleString()}`,
          ),
        );
        console.log(
          chalk.gray(
            `   Progress: ${state.completed}/${state.total} completed, ${state.failed} failed`,
          ),
        );
        console.log(
          chalk.gray(`   Remaining: ${state.files.remaining.length} files\n`),
        );

        return state;
      }
    }
  } catch (error) {
    // Ignore errors and start fresh
  }

  return null;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return "0s";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function createBatchProcessor<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  options: {
    batchSize?: number;
    concurrency?: number;
    onProgress?: (completed: number, total: number) => void;
  } = {},
) {
  const { batchSize = 10, concurrency = 3, onProgress } = options;

  return {
    async process(): Promise<{ completed: number; failed: number }> {
      let completed = 0;
      let failed = 0;

      // Process items in batches with limited concurrency
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);

        // Limit concurrency within batch
        const semaphore = new Semaphore(concurrency);

        await Promise.all(
          batch.map(async (item) => {
            await semaphore.acquire();
            try {
              await processor(item);
              completed++;
            } catch (error) {
              failed++;
            } finally {
              semaphore.release();
              if (onProgress) {
                onProgress(completed + failed, items.length);
              }
            }
          }),
        );
      }

      return { completed, failed };
    },
  };
}

class Semaphore {
  private permits: number;
  private waiting: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      resolve();
    } else {
      this.permits++;
    }
  }
}
