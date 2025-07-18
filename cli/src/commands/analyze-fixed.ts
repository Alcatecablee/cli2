import chalk from "chalk";
import ora from "ora";
import { glob } from "glob";
import fs from "fs-extra";
import path from "path";
import axios from "axios";
import { loadConfig, validateConfig } from "../utils/config";

interface AnalyzeOptions {
  layers?: string;
  output?: string;
  recursive?: boolean;
  include?: string;
  exclude?: string;
  config?: string;
}

interface AnalysisResult {
  success: boolean;
  filesAnalyzed: number;
  issuesFound: number;
  layersUsed: number[];
  issues: Array<{
    file: string;
    layer: number;
    rule: string;
    severity: "error" | "warning" | "info";
    message: string;
    line?: number;
    column?: number;
  }>;
  performance: {
    duration: number;
    layerTimes: Record<number, number>;
  };
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

    // Determine files to analyze
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
      spinner.fail("No files found to analyze");
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

    spinner.text = `Analyzing ${existingFiles.length} files with layers [${layers.join(", ")}]...`;

        // Process files one by one since the API expects single files
    const allResults: any[] = [];
    let totalIssues = 0;

    for (const file of existingFiles) {
      try {
        const code = await fs.readFile(file, "utf-8");

        // Send analysis request for single file
        const analysisPayload = {
          code,
          filename: file,
          layers: layers.join(","),
          applyFixes: false,
          metadata: {
            recursive: options.recursive,
            outputFormat: options.output || config.output.format,
            verbose: config.output.verbose,
          },
        };

    try {
              const response = await axios.post(
          `${config.api.url}/analyze`,
          analysisPayload,
          {
            headers: {
              "X-API-Key": config.apiKey,
              "Content-Type": "application/json",
            },
            timeout: config.api.timeout,
          },
        );

        const result = response.data;
        allResults.push({ file, result });
        totalIssues += result.analysis?.detectedIssues?.length || 0;

      } catch (fileError) {
        console.log(chalk.yellow(`Warning: Could not analyze ${file}`));
        console.log(chalk.gray(`Error: ${fileError instanceof Error ? fileError.message : String(fileError)}`));
      }
    }

    spinner.succeed(`Analysis completed for ${existingFiles.length} files`);

    // Aggregate results
    const aggregatedResult = {
      filesAnalyzed: existingFiles.length,
      issuesFound: totalIssues,
      layersUsed: layers,
      results: allResults,
      performance: {
        duration: Date.now() - startTime,
        layerTimes: {},
      },
    };

      // Display results
      console.log();
      console.log(chalk.white.bold("Analysis Results"));
      console.log();
      console.log(
        chalk.white("Files analyzed: ") + chalk.cyan(result.filesAnalyzed),
      );
      console.log(
        chalk.white("Issues found: ") +
          (result.issuesFound > 0
            ? chalk.yellow(result.issuesFound)
            : chalk.green("0")),
      );
      console.log(
        chalk.white("Layers used: ") +
          chalk.gray(`[${result.layersUsed.join(", ")}]`),
      );
      console.log(
        chalk.white("Duration: ") +
          chalk.gray(`${result.performance.duration}ms`),
      );
      console.log();

      if (result.issuesFound > 0) {
        // Group issues by layer
        const issuesByLayer: Record<
          number,
          Array<(typeof result.issues)[0]>
        > = {};
        result.issues.forEach((issue) => {
          if (!issuesByLayer[issue.layer]) {
            issuesByLayer[issue.layer] = [];
          }
          issuesByLayer[issue.layer].push(issue);
        });

        console.log(chalk.white("Issues by Layer:"));
        for (const layer of result.layersUsed) {
          const layerIssues = issuesByLayer[layer] || [];
          const layerName =
            config.layers.config[layer]?.name || `Layer ${layer}`;
          console.log(
            chalk.gray(`  ${layerName}: `) +
              (layerIssues.length > 0
                ? chalk.yellow(`${layerIssues.length} issues`)
                : chalk.green("✓ passed")),
          );

          // Show first few issues for each layer
          if (
            layerIssues.length > 0 &&
            (options.output === "table" || !options.output)
          ) {
            layerIssues.slice(0, 3).forEach((issue) => {
              const location = issue.line
                ? `:${issue.line}${issue.column ? `:${issue.column}` : ""}`
                : "";
              console.log(
                chalk.gray(`    ${issue.file}${location} - ${issue.message}`),
              );
            });
            if (layerIssues.length > 3) {
              console.log(
                chalk.gray(`    ... and ${layerIssues.length - 3} more`),
              );
            }
          }
        }
        console.log();

        // Output formatted results if requested
        if (options.output === "json") {
          console.log(JSON.stringify(result, null, 2));
        }

        console.log(chalk.white("Next steps:"));
        console.log(
          chalk.gray("  • Run 'neurolint fix' to automatically fix issues"),
        );
        console.log(
          chalk.gray(
            "  • Run 'neurolint analyze --output=json' for detailed results",
          ),
        );
      } else {
        console.log(chalk.green("No issues found! Your code looks great."));
      }
    } catch (error) {
      spinner.fail("Analysis failed");

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
    spinner.fail("Analysis initialization failed");
    console.log(
      chalk.red(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}