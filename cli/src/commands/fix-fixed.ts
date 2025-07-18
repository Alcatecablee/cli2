import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import axios from "axios";
import { glob } from "glob";
import { loadConfig, validateConfig } from "../utils/config";

interface FixOptions {
  layers?: string;
  recursive?: boolean;
  dryRun?: boolean;
  backup?: boolean;
  include?: string;
  exclude?: string;
  config?: string;
}

interface FixResult {
  success: boolean;
  filesModified: number;
  issuesFixed: number;
  layersUsed: number[];
  fixes: Array<{
    file: string;
    layer: number;
    rule: string;
    description: string;
    before: string;
    after: string;
    line: number;
  }>;
  performance: {
    duration: number;
  };
}

/**
 * Layer Dependency Management (from IMPLEMENTATION_PATTERNS.md)
 * Validates and corrects layer selection based on dependencies
 */
function validateAndCorrectLayers(requestedLayers: number[]) {
  const DEPENDENCIES = {
    1: [], // Configuration has no dependencies
    2: [1], // Entity cleanup depends on config foundation
    3: [1, 2], // Components depend on config + cleanup
    4: [1, 2, 3], // Hydration depends on all previous layers
    5: [1, 2, 3, 4], // Next.js depends on all core layers
    6: [1, 2, 3, 4, 5], // Testing depends on all previous layers
  };

  const LAYER_INFO = {
    1: { name: "Configuration", critical: true },
    2: { name: "Entity Cleanup", critical: false },
    3: { name: "Components", critical: false },
    4: { name: "Hydration", critical: false },
    5: { name: "Next.js App Router", critical: false },
    6: { name: "Testing & Validation", critical: false },
  };

  const warnings: string[] = [];
  const autoAdded: number[] = [];
  let correctedLayers = [...requestedLayers];

  // Sort layers in execution order
  correctedLayers.sort((a, b) => a - b);

  // Check dependencies for each requested layer
  for (const layerId of requestedLayers) {
    const dependencies =
      DEPENDENCIES[layerId as keyof typeof DEPENDENCIES] || [];
    const missingDeps = dependencies.filter(
      (dep) => !correctedLayers.includes(dep),
    );

    if (missingDeps.length > 0) {
      // Auto-add missing dependencies
      correctedLayers.push(...missingDeps);
      autoAdded.push(...missingDeps);

      warnings.push(
        `Layer ${layerId} (${LAYER_INFO[layerId as keyof typeof LAYER_INFO]?.name}) requires ` +
          `${missingDeps.map((dep) => `${dep} (${LAYER_INFO[dep as keyof typeof LAYER_INFO]?.name})`).join(", ")}. ` +
          `Auto-added missing dependencies.`,
      );
    }
  }

  // Remove duplicates and sort
  correctedLayers = [...new Set(correctedLayers)].sort((a, b) => a - b);

  return {
    correctedLayers,
    warnings,
    autoAdded,
  };
}

export async function fixCommand(files: string[], options: FixOptions) {
  const spinner = ora("Initializing NeuroLint fixes...").start();
  const startTime = Date.now();

  try {
    // Load and validate configuration
    const config = await loadConfig(options.config);
    const configValidation = await validateConfig(config);

    if (!configValidation.valid) {
      spinner.fail("Configuration validation failed");
      configValidation.errors.forEach((error) =>
        console.log(chalk.red(`ERROR: ${error}`)),
      );
      return;
    }

    // Check authentication
    if (!config.apiKey) {
      spinner.fail("Authentication required");
      console.log(chalk.yellow('Run "neurolint login" to authenticate first'));
      return;
    }

    // Parse layers
    const requestedLayers = options.layers
      ? options.layers
          .split(",")
          .map((l) => parseInt(l.trim()))
          .filter((l) => l >= 1 && l <= 6)
      : config.layers.enabled;

    // Apply Layer Dependency Management (from IMPLEMENTATION_PATTERNS.md)
    const layerValidation = validateAndCorrectLayers(requestedLayers);
    const layers = layerValidation.correctedLayers;
    if (layerValidation.warnings.length > 0) {
      layerValidation.warnings.forEach((warning) =>
        console.log(chalk.yellow(`DEPENDENCY: ${warning}`)),
      );
    }

    // Check premium features for layers 5 and 6
    const premiumLayers = layers.filter((layer) => layer >= 5);
    if (premiumLayers.length > 0) {
      try {
        const userResponse = await axios.get(
          `${config.api.url}/auth/api-keys`,
          {
            headers: { "X-API-Key": config.apiKey },
            timeout: 10000,
          },
        );

        // Handle different response structures from API
        const plan =
          userResponse.data.plan ||
          userResponse.data.user?.plan ||
          userResponse.data.apiKey?.plan ||
          "free";
        if (plan === "free" && premiumLayers.length > 0) {
          spinner.fail("Premium features required");
          console.log(
            chalk.yellow(
              `Layers ${premiumLayers.join(", ")} require Pro plan ($24.99/month)`,
            ),
          );
          console.log(chalk.gray("Upgrade at: https://neurolint.dev/pricing"));
          return;
        }
      } catch (error) {
        console.log(
          chalk.yellow("Unable to verify premium features, continuing..."),
        );
      }
    }

    // Determine files to fix
    let targetFiles: string[] = [];

    if (files.length > 0) {
      targetFiles = files;
    } else {
      // Use glob patterns from config
      spinner.text = "Discovering files...";
      try {
        for (const pattern of config.files.include) {
          const foundFiles = await glob(pattern, {
            ignore: config.files.exclude,
            cwd: process.cwd(),
          });
          targetFiles.push(...foundFiles);
        }
      } catch (error) {
        spinner.fail("File discovery failed");
        console.log(
          chalk.red(
            `Error: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
        return;
      }
    }

    if (targetFiles.length === 0) {
      spinner.fail("No files found to fix");
      console.log(
        chalk.yellow(
          "Try specifying files explicitly or check your include/exclude patterns",
        ),
      );
      return;
    }

    // Remove duplicates and filter existing files
    targetFiles = [...new Set(targetFiles)];
    const existingFiles = [];
    for (const file of targetFiles) {
      if (await fs.pathExists(file)) {
        existingFiles.push(file);
      }
    }

    if (existingFiles.length === 0) {
      spinner.fail("No valid files found");
      return;
    }

    // Create backup directory if needed
    let backupDir: string | undefined;
    if (
      options.backup ||
      (!options.dryRun && !process.env.NEUROLINT_NO_BACKUP)
    ) {
      backupDir = path.join(
        process.cwd(),
        ".neurolint-backups",
        new Date().toISOString().split("T")[0],
      );
      if (!options.dryRun) {
        await fs.ensureDir(backupDir);
      }
    }

    if (options.dryRun) {
      spinner.text = `Previewing fixes for ${existingFiles.length} files...`;
    } else {
      spinner.text = `Applying fixes to ${existingFiles.length} files with layers [${layers.join(", ")}]...`;
    }

    // Process files one by one since the API expects single files
    const allResults: any[] = [];
    let totalFixed = 0;
    let filesModified = 0;

    for (const file of existingFiles) {
      try {
        const code = await fs.readFile(file, "utf-8");

        // Create backup if needed
        if (backupDir && !options.dryRun) {
          const backupPath = path.join(backupDir, file);
          await fs.ensureDir(path.dirname(backupPath));
          await fs.copy(file, backupPath);
        }

        // Send fix request for single file
        const fixPayload = {
          code,
          filename: file,
          layers: layers.length === 1 ? layers[0].toString() : layers.join(","),
          applyFixes: !options.dryRun, // Apply fixes unless it's a dry run
          metadata: {
            recursive: options.recursive,
            backup: !!backupDir,
            dryRun: options.dryRun,
          },
        };

        const response = await axios.post(
          `${config.api.url}/analyze`,
          fixPayload,
          {
            headers: {
              "X-API-Key": config.apiKey,
              "Content-Type": "application/json",
            },
            timeout: config.api.timeout,
          },
        );

        const result = response.data;

        // If fixes were applied and we have the fixed code, write it back
        if (!options.dryRun && result.fixedCode && result.fixedCode !== code) {
          await fs.writeFile(file, result.fixedCode, "utf-8");
          filesModified++;
        }

        allResults.push({ file, result });
        totalFixed +=
          result.analysis?.detectedIssues?.filter((issue: any) => issue.fixed)
            ?.length || 0;
      } catch (fileError) {
        console.log(chalk.yellow(`Warning: Could not fix ${file}`));
        if (axios.isAxiosError(fileError)) {
          if (fileError.response?.status === 401) {
            console.log(
              chalk.red(
                "Authentication failed. Please run 'neurolint login' again.",
              ),
            );
          } else if (fileError.response?.status === 403) {
            console.log(
              chalk.red("Access denied. Check your API permissions."),
            );
          } else {
            console.log(
              chalk.gray(
                `API Error: ${fileError.response?.status} ${fileError.response?.statusText}`,
              ),
            );
          }
        } else {
          console.log(
            chalk.gray(
              `Error: ${fileError instanceof Error ? fileError.message : String(fileError)}`,
            ),
          );
        }
      }
    }

    const processingTime = Date.now() - startTime;

    if (options.dryRun) {
      spinner.succeed(
        `Fix preview completed for ${existingFiles.length} files`,
      );
    } else {
      spinner.succeed(`Fixes applied to ${existingFiles.length} files`);
    }

    // Aggregate results
    const aggregatedResult = {
      filesModified: options.dryRun ? 0 : filesModified,
      issuesFixed: totalFixed,
      layersUsed: layers,
      results: allResults,
      performance: {
        duration: processingTime,
      },
    };

    // Display results
    console.log();
    if (options.dryRun) {
      console.log(chalk.white.bold("Fix Preview Results"));
    } else {
      console.log(chalk.white.bold("Fix Results"));
    }
    console.log();

    console.log(
      chalk.white("Files processed: ") + chalk.cyan(existingFiles.length),
    );

    if (!options.dryRun) {
      console.log(
        chalk.white("Files modified: ") +
          chalk.cyan(aggregatedResult.filesModified),
      );
    }

    console.log(
      chalk.white("Issues fixed: ") +
        (aggregatedResult.issuesFixed > 0
          ? chalk.green(aggregatedResult.issuesFixed)
          : chalk.yellow("0")),
    );

    console.log(
      chalk.white("Layers used: ") +
        chalk.gray(`[${aggregatedResult.layersUsed.join(", ")}]`),
    );

    console.log(
      chalk.white("Duration: ") +
        chalk.gray(`${aggregatedResult.performance.duration}ms`),
    );

    if (backupDir && !options.dryRun) {
      console.log(chalk.white("Backups saved to: ") + chalk.gray(backupDir));
    }

    console.log();

    if (aggregatedResult.issuesFixed > 0) {
      // Show summary of fixes by layer
      const fixesByLayer: Record<number, any[]> = {};

      allResults.forEach(({ file, result }) => {
        if (result.analysis?.detectedIssues) {
          result.analysis.detectedIssues.forEach((issue: any) => {
            if (issue.fixed) {
              const layer = issue.layer || 1;
              if (!fixesByLayer[layer]) {
                fixesByLayer[layer] = [];
              }
              fixesByLayer[layer].push({ ...issue, file });
            }
          });
        }
      });

      console.log(chalk.white("Fixes by Layer:"));
      for (const layer of aggregatedResult.layersUsed) {
        const layerFixes = fixesByLayer[layer] || [];
        const layerName = config.layers.config[layer]?.name || `Layer ${layer}`;
        console.log(
          chalk.gray(`  ${layerName}: `) +
            (layerFixes.length > 0
              ? chalk.green(`${layerFixes.length} fixes applied`)
              : chalk.gray("no fixes")),
        );
      }
      console.log();

      if (options.dryRun) {
        console.log(chalk.white("Next steps:"));
        console.log(
          chalk.gray(
            "  • Run 'neurolint fix' without --dry-run to apply fixes",
          ),
        );
        console.log(chalk.gray("  • Add --backup to create backup files"));
      } else {
        console.log(chalk.green("Fixes applied successfully!"));
        console.log(
          chalk.gray("  • Run 'neurolint analyze' to verify the fixes"),
        );
      }
    } else {
      if (options.dryRun) {
        console.log(chalk.gray("No fixes would be applied."));
      } else {
        console.log(chalk.gray("No fixes were needed."));
      }
    }
  } catch (error) {
    spinner.fail("Fix operation failed");
    console.log(
      chalk.red(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}
