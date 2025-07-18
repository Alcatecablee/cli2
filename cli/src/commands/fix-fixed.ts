import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import axios from "axios";
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
  backupDir?: string;
}

export async function fixCommand(files: string[], options: FixOptions) {
  const spinner = ora("Preparing to fix code issues...").start();

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
    const layers = options.layers
      ? options.layers
          .split(",")
          .map((l) => parseInt(l.trim()))
          .filter((l) => l >= 1 && l <= 6)
      : config.layers.enabled;

    // Check premium features for layers 5 and 6
    const premiumLayers = layers.filter((layer) => layer >= 5);
    if (premiumLayers.length > 0) {
      try {
        const userResponse = await axios.get(
          `${config.api.url}/api/user/profile`,
          {
            headers: { Authorization: `Bearer ${config.apiKey}` },
            timeout: 10000,
          },
        );

        const plan = userResponse.data.plan || "free";
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
      // Use current directory
      targetFiles = ["src/"];
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
      spinner.text = "Previewing potential fixes...";
    } else {
      spinner.text = `Applying fixes with layers [${layers.join(", ")}]...`;
    }

    // Send fix request to your API
    const fixPayload = {
      files: targetFiles,
      layers: layers,
      options: {
        dryRun: options.dryRun,
        recursive: options.recursive,
        backup: !!backupDir,
      },
    };

    try {
      const response = await axios.post(
        `${config.api.url}/api/fix`,
        fixPayload,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: config.api.timeout,
        },
      );

      const result: FixResult = response.data;
      spinner.succeed(
        options.dryRun ? "Fix preview completed" : "Fixes applied successfully",
      );

      // Display results
      console.log();
      if (options.dryRun) {
        console.log(chalk.white.bold("Fix Preview"));
        console.log();
        console.log(
          chalk.white("Files that would be modified: ") +
            chalk.cyan(result.filesModified),
        );
        console.log(
          chalk.white("Total fixes: ") + chalk.green(result.issuesFixed),
        );
        console.log(
          chalk.white("Layers used: ") +
            chalk.gray(`[${result.layersUsed.join(", ")}]`),
        );
        console.log();

        if (result.fixes.length > 0) {
          console.log(chalk.white("Preview of fixes:"));
          const fixesByLayer: Record<
            number,
            Array<(typeof result.fixes)[0]>
          > = {};
          result.fixes.forEach((fix) => {
            if (!fixesByLayer[fix.layer]) {
              fixesByLayer[fix.layer] = [];
            }
            fixesByLayer[fix.layer].push(fix);
          });

          for (const layer of result.layersUsed) {
            const layerFixes = fixesByLayer[layer] || [];
            if (layerFixes.length > 0) {
              const layerName =
                config.layers.config[layer]?.name || `Layer ${layer}`;
              console.log(
                chalk.gray(`  ${layerName}: ${layerFixes.length} fixes`),
              );

              // Show first few fixes
              layerFixes.slice(0, 3).forEach((fix) => {
                console.log(
                  chalk.gray(
                    `    ${fix.file}:${fix.line} - ${fix.description}`,
                  ),
                );
              });
              if (layerFixes.length > 3) {
                console.log(
                  chalk.gray(`    ... and ${layerFixes.length - 3} more`),
                );
              }
            }
          }
        }

        console.log();
        console.log(chalk.gray("Run without --dry-run to apply these fixes"));
      } else {
        console.log(chalk.white.bold("Fixes Applied"));
        console.log();
        console.log(
          chalk.white("Files modified: ") + chalk.cyan(result.filesModified),
        );
        console.log(
          chalk.white("Issues fixed: ") + chalk.green(result.issuesFixed),
        );
        console.log(
          chalk.white("Layers used: ") +
            chalk.gray(`[${result.layersUsed.join(", ")}]`),
        );

        if (backupDir && result.backupDir) {
          console.log(
            chalk.white("Backups created: ") + chalk.gray(result.backupDir),
          );
        }

        console.log();

        if (result.issuesFixed > 0) {
          console.log(chalk.green("Your code has been improved!"));
          console.log();
          console.log(chalk.white("Summary of fixes:"));

          // Group fixes by layer
          const fixesByLayer: Record<number, number> = {};
          result.fixes.forEach((fix) => {
            fixesByLayer[fix.layer] = (fixesByLayer[fix.layer] || 0) + 1;
          });

          for (const layer of result.layersUsed) {
            const count = fixesByLayer[layer] || 0;
            if (count > 0) {
              const layerName =
                config.layers.config[layer]?.name || `Layer ${layer}`;
              console.log(chalk.gray(`  ${layerName}: ${count} fixes applied`));
            }
          }

          console.log();
          console.log(chalk.white("Next steps:"));
          console.log(chalk.gray("  • Review the changes in your files"));
          console.log(
            chalk.gray("  • Run your tests to ensure everything works"),
          );
          console.log(
            chalk.gray(
              "  • Run 'neurolint analyze' to check for remaining issues",
            ),
          );
        } else {
          console.log(
            chalk.green(
              "No fixes were needed - your code is already optimized!",
            ),
          );
        }
      }
    } catch (error) {
      spinner.fail(
        options.dryRun ? "Fix preview failed" : "Fix process failed",
      );

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log(
            chalk.red(
              "Authentication failed. Please run 'neurolint login' again.",
            ),
          );
        } else if (error.response?.status === 403) {
          console.log(chalk.red("Access denied. Check your API permissions."));
        } else if (error.code === "ECONNREFUSED") {
          console.log(
            chalk.red(`Cannot connect to NeuroLint API at ${config.api.url}`),
          );
          console.log(chalk.gray("Make sure the NeuroLint server is running."));
        } else {
          console.log(
            chalk.red(
              `API Error: ${error.response?.status} ${error.response?.statusText}`,
            ),
          );
          if (error.response?.data?.message) {
            console.log(chalk.gray(error.response.data.message));
          }
        }
      } else {
        console.log(
          chalk.red(
            `Error: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    }
  } catch (error) {
    spinner.fail("Fix initialization failed");
    console.log(
      chalk.red(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}
