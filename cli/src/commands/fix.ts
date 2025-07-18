import chalk from "chalk";
import ora from "ora";
import { glob } from "glob";
import fs from "fs-extra";
import path from "path";
import axios from "axios";
import inquirer from "inquirer";
import { loadConfig, validateConfig } from "../utils/config";
import { createBackup } from "../utils/backup";
import { validateFiles, validateLayerNumbers } from "../utils/validation";
import { withRetry } from "../utils/retry";
import { ProgressTracker, resumeOperation } from "../utils/progress";

interface FixOptions {
  layers?: string;
  recursive?: boolean;
  dryRun?: boolean;
  backup?: boolean;
  include?: string;
  exclude?: string;
  config?: string;
}

export async function fixCommand(files: string[], options: FixOptions) {
  const spinner = ora("Initializing NeuroLint fixes...").start();

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
        maxFiles: 500, // Lower limit for fixes due to backup overhead
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

    spinner.succeed(`Found ${uniqueFiles.length} valid files to fix`);

    // Parse layers
    const layers = options.layers
      ?.split(",")
      .map((l) => parseInt(l.trim())) || [1, 2, 3, 4];

    if (options.dryRun) {
      console.log(chalk.white("\nDRY RUN MODE - No files will be modified\n"));
    }

    console.log(chalk.white(`\nFixing with layers: ${layers.join(", ")}\n`));

    // Check for resumable operation
    const resumeState = await resumeOperation("fix");
    let filesToProcess = uniqueFiles;

    if (resumeState && !options.dryRun) {
      const { resume } = await inquirer.prompt([
        {
          type: "confirm",
          name: "resume",
          message: "Resume previous fix operation?",
          default: true,
        },
      ]);

      if (resume) {
        filesToProcess = resumeState.files.remaining;
        console.log(
          chalk.white(
            `\nResuming fix operation with ${filesToProcess.length} remaining files\n`,
          ),
        );
      }
    }

    // Initialize progress tracker
    const progress = new ProgressTracker("Fix", filesToProcess);
    await progress.start();

    const results: any[] = [];
    const fixedFiles: string[] = [];

    // Process files with controlled concurrency and robust error handling
    const BATCH_SIZE = 3; // Even smaller for fixes due to file I/O
    const MAX_CONCURRENT = 2;

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

                // Call NeuroLint transformation API with retry logic
                const response = await axios.post(
                  `${config.api?.url || "https://api.neurolint.dev"}/api/transform`,
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
                    timeout: config.api?.timeout || 60000,
                  },
                );

                const { transformed, layers: layerResults } = response.data;

                // Check if any changes were made
                const hasChanges = transformed !== content;

                if (hasChanges && !options.dryRun) {
                  // Create backup if requested
                  if (options.backup) {
                    await createBackup(filePath, { maxBackups: 5 });
                  }

                  // Write fixed content atomically
                  const tempFile = `${filePath}.neurolint.tmp`;
                  await fs.writeFile(tempFile, transformed, "utf-8");
                  await fs.move(tempFile, filePath);
                  fixedFiles.push(relativePath);
                }

                return {
                  file: relativePath,
                  success: true,
                  hasChanges,
                  layers: layerResults,
                  originalSize: content.length,
                  transformedSize: transformed.length,
                };
              },
              {
                maxAttempts: 2, // Fewer retries for fixes due to potential file conflicts
                delay: 2000,
                onRetry: (error, attempt) => {
                  console.log(
                    chalk.gray(
                      `Retrying fix for ${path.relative(process.cwd(), filePath)} (attempt ${attempt})`,
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
              hasChanges: false,
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

    // Display results
    console.log(chalk.white("\nFix Operation Complete\n"));

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);
    const withChanges = results.filter((r) => r.hasChanges);

    if (options.dryRun) {
      console.log(chalk.white("Dry Run Results:"));
      withChanges.forEach((result) => {
        console.log(`CHANGE ${result.file} - Would be modified`);
      });
    } else {
      console.log(chalk.white("Fixed Files:"));
      fixedFiles.forEach((file) => {
        console.log(`PASS ${file}`);
      });
    }

    // Summary statistics
    console.log(chalk.white("\nSummary:"));
    console.log(`Successfully processed: ${successful.length}`);
    console.log(`Files with changes: ${withChanges.length}`);
    if (failed.length > 0) {
      console.log(`Failed: ${failed.length}`);
    }

    // Show layer performance
    if (successful.length > 0) {
      const layerStats: Record<string, { applied: number; total: number }> = {};
      successful.forEach((result: any) => {
        if (result.layers) {
          result.layers.forEach((layer: any) => {
            if (!layerStats[layer.id]) {
              layerStats[layer.id] = { applied: 0, total: 0 };
            }
            layerStats[layer.id].total++;
            if (layer.status === "success" && layer.changes > 0) {
              layerStats[layer.id].applied++;
            }
          });
        }
      });

      console.log(chalk.white("\nLayer Applications:"));
      Object.entries(layerStats).forEach(([layerId, stats]: [string, any]) => {
        console.log(
          `Layer ${layerId}: ${stats.applied}/${stats.total} files modified`,
        );
      });
    }

    // Offer to run analysis after fixes
    if (!options.dryRun && fixedFiles.length > 0) {
      const { runAnalysis } = await inquirer.prompt([
        {
          type: "confirm",
          name: "runAnalysis",
          message:
            "Would you like to run analysis on the fixed files to verify improvements?",
          default: true,
        },
      ]);

      if (runAnalysis) {
        console.log(chalk.white("\nRunning verification analysis...\n"));
        const { analyzeCommand } = await import("./analyze");
        await analyzeCommand(fixedFiles, {
          layers: options.layers,
          output: "summary",
        });
      }
    }
  } catch (error) {
    spinner.fail(
      `Fix operation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      } else if (error.message.includes("ENOSPC")) {
        console.log(
          chalk.white(
            "\nNo space left on device. Free up disk space and try again",
          ),
        );
      } else if (error.message.includes("EACCES")) {
        console.log(chalk.white("\nPermission denied. Check file permissions"));
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
