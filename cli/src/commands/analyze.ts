import chalk from "chalk";
import ora from "ora";
import { glob } from "glob";
import fs from "fs-extra";
import path from "path";
import axios from "axios";
import { loadConfig, validateConfig } from "../utils/config";
import { formatResults } from "../utils/formatter";
import {
  validateFiles,
  validateLayerNumbers,
  validateOutputFormat,
} from "../utils/validation";
import { withRetry } from "../utils/retry";
import { ProgressTracker, resumeOperation } from "../utils/progress";

interface AnalyzeOptions {
  layers?: string;
  output?: string;
  recursive?: boolean;
  include?: string;
  exclude?: string;
  config?: string;
}

export async function analyzeCommand(files: string[], options: AnalyzeOptions) {
  const spinner = ora("Initializing NeuroLint analysis...").start();

  try {
    // Load and validate configuration
    const config = await loadConfig(options.config);
    const configValidation = await validateConfig(config);

    if (!configValidation.valid) {
      spinner.fail("Configuration validation failed");
      configValidation.errors.forEach((error) =>
        console.log(chalk.white(`ERROR: ${error}`)),
      );
      return;
    }

    // Check authentication
    if (!config.apiKey) {
      spinner.fail("Authentication required");
      console.log(chalk.white('Run "neurolint login" to authenticate first'));
      return;
    }

    // Validate input parameters
    const layersValidation = validateLayerNumbers(options.layers || "1,2,3,4");
    if (!layersValidation.valid) {
      spinner.fail("Invalid layer specification");
      layersValidation.errors.forEach((error) =>
        console.log(chalk.white(`ERROR: ${error}`)),
      );
      return;
    }

    const outputValidation = validateOutputFormat(options.output || "table");
    if (!outputValidation.valid) {
      spinner.fail("Invalid output format");
      outputValidation.errors.forEach((error) =>
        console.log(chalk.white(`ERROR: ${error}`)),
      );
      return;
    }

    // Resolve file patterns
    const filePatterns =
      files.length > 0
        ? files
        : config.files?.include || ["**/*.{ts,tsx,js,jsx}"];
    const includePatterns = options.include?.split(",") || [];
    const excludePatterns = options.exclude?.split(",") ||
      config.files?.exclude || ["node_modules/**", "dist/**", "build/**"];

    spinner.text = "Discovering and validating files...";

    // Validate files with comprehensive checks
    const fileValidation = await validateFiles(
      [...filePatterns, ...includePatterns],
      {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedExtensions: [".ts", ".tsx", ".js", ".jsx"],
        maxFiles: 1000,
      },
    );

    if (!fileValidation.valid) {
      spinner.fail("File validation failed");
      fileValidation.errors.forEach((error) =>
        console.log(chalk.white(`ERROR: ${error}`)),
      );
      return;
    }

    if (fileValidation.warnings.length > 0) {
      spinner.warn("File validation warnings");
      fileValidation.warnings.forEach((warning) =>
        console.log(chalk.gray(`WARNING: ${warning}`)),
      );
    }

    const uniqueFiles = fileValidation.files;

    if (uniqueFiles.length === 0) {
      spinner.fail("No valid files found matching the specified patterns");
      return;
    }

    spinner.succeed(`Found ${uniqueFiles.length} valid files to analyze`);

    // Parse layers
    const layers = options.layers
      ?.split(",")
      .map((l) => parseInt(l.trim())) || [1, 2, 3, 4];

    console.log(chalk.white(`\nAnalyzing with layers: ${layers.join(", ")}\n`));

    // Check for resumable operation
    const resumeState = await resumeOperation("analyze");
    let filesToProcess = uniqueFiles;
    let results: any[] = [];

    if (resumeState) {
      console.log(
        chalk.blue("Would you like to resume the previous analysis?"),
      );
      filesToProcess = resumeState.files.remaining;
      // Note: In a real implementation, we'd also load previous results
    }

    // Initialize progress tracker
    const progress = new ProgressTracker("Analysis", filesToProcess);
    await progress.start();

    // Process files in batches with retry logic
    const BATCH_SIZE = 5; // Smaller batches for better error isolation
    const MAX_CONCURRENT = 3;

    for (let i = 0; i < filesToProcess.length; i += BATCH_SIZE) {
      const batch = filesToProcess.slice(i, i + BATCH_SIZE);

      // Process batch with controlled concurrency
      const semaphore = new Semaphore(MAX_CONCURRENT);
      const batchResults = await Promise.allSettled(
        batch.map(async (filePath) => {
          await semaphore.acquire();
          try {
            const result = await withRetry(
              async () => {
                const content = await fs.readFile(filePath, "utf-8");
                const relativePath = path.relative(process.cwd(), filePath);

                // Call NeuroLint API with retry logic
                const response = await axios.post(
                  `${config.api?.url || "https://api.neurolint.dev"}/api/analyze`,
                  {
                    code: content,
                    filePath: relativePath,
                    layers,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${config.apiKey}`,
                      "Content-Type": "application/json",
                    },
                    timeout: config.api?.timeout || 30000,
                  },
                );

                return {
                  file: relativePath,
                  success: true,
                  ...response.data,
                };
              },
              {
                maxAttempts: 3,
                delay: 1000,
                onRetry: (error, attempt) => {
                  console.log(
                    chalk.gray(
                      `Retrying ${path.relative(process.cwd(), filePath)} (attempt ${attempt})`,
                    ),
                  );
                },
              },
            );

            await progress.markCompleted(filePath);
            return result;
          } catch (error) {
            await progress.markFailed(
              filePath,
              error instanceof Error ? error.message : "Unknown error",
            );
            return {
              file: path.relative(process.cwd(), filePath),
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            };
          } finally {
            semaphore.release();
          }
        }),
      );

      // Collect results from settled promises
      batchResults.forEach((result) => {
        if (result.status === "fulfilled") {
          results.push(result.value);
        }
      });
    }

    await progress.complete(true);

    // Format and display results
    console.log(chalk.white("\nAnalysis Complete\n"));

    formatResults(results, options.output || "table");

    // Summary statistics
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(chalk.white(`\nSummary:`));
    console.log(chalk.white(`Successfully analyzed: ${successful.length}`));
    if (failed.length > 0) {
      console.log(chalk.white(`Failed: ${failed.length}`));
    }

    // Show layer-specific stats
    if (successful.length > 0) {
      const layerStats: Record<string, { passed: number; total: number }> = {};
      successful.forEach((result: any) => {
        if (result.layers) {
          result.layers.forEach((layer: any) => {
            if (!layerStats[layer.id]) {
              layerStats[layer.id] = { passed: 0, total: 0 };
            }
            layerStats[layer.id].total++;
            if (layer.status === "success") {
              layerStats[layer.id].passed++;
            }
          });
        }
      });

      console.log(chalk.white("\nLayer Performance:"));
      Object.entries(layerStats).forEach(([layerId, stats]: [string, any]) => {
        const percentage = Math.round((stats.passed / stats.total) * 100);
        console.log(
          chalk.white(
            `Layer ${layerId}: ${stats.passed}/${stats.total} (${percentage}%)`,
          ),
        );
      });
    }
  } catch (error) {
    spinner.fail(
      `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        console.log(
          chalk.white("\nMake sure the NeuroLint server is running:"),
        );
        console.log(
          chalk.gray("   npm run dev (in the main project directory)"),
        );
      } else if (
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        console.log(
          chalk.white(
            '\nAuthentication failed. Run "neurolint login" to re-authenticate',
          ),
        );
      } else if (error.message.includes("429")) {
        console.log(
          chalk.white("\nRate limit exceeded. Please wait before trying again"),
        );
      } else if (
        error.message.includes("EMFILE") ||
        error.message.includes("ENFILE")
      ) {
        console.log(
          chalk.white(
            "\nToo many open files. Try reducing batch size or increasing system limits",
          ),
        );
      }
    }
    process.exit(1);
  }
}

// Semaphore for controlling concurrency
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
