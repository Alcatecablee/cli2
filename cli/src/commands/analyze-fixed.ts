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
          layers: layers.length === 1 ? layers[0].toString() : layers.join(","),
          applyFixes: false,
          metadata: {
            recursive: options.recursive,
            outputFormat: options.output || config.output.format,
            verbose: config.output.verbose,
          },
        };

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

        // Handle different response structures
        const detectedIssues =
          result.analysis?.detectedIssues ||
          result.detectedIssues ||
          result.layers?.flatMap((l) => l.detectedIssues) ||
          [];
        totalIssues += detectedIssues.length;
      } catch (fileError) {
        console.log(chalk.yellow(`Warning: Could not analyze ${file}`));
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
    spinner.succeed(`Analysis completed for ${existingFiles.length} files`);

    // Aggregate results
    const aggregatedResult = {
      filesAnalyzed: existingFiles.length,
      issuesFound: totalIssues,
      layersUsed: layers,
      results: allResults,
      performance: {
        duration: processingTime,
        layerTimes: {},
      },
    };

    // Display results
    console.log();
    console.log(chalk.white.bold("Analysis Results"));
    console.log();
    console.log(
      chalk.white("Files analyzed: ") +
        chalk.cyan(aggregatedResult.filesAnalyzed),
    );
    console.log(
      chalk.white("Issues found: ") +
        (aggregatedResult.issuesFound > 0
          ? chalk.yellow(aggregatedResult.issuesFound)
          : chalk.green("0")),
    );
    console.log(
      chalk.white("Layers used: ") +
        chalk.gray(`[${aggregatedResult.layersUsed.join(", ")}]`),
    );
    console.log(
      chalk.white("Duration: ") +
        chalk.gray(`${aggregatedResult.performance.duration}ms`),
    );
    console.log();

    if (aggregatedResult.issuesFound > 0) {
      // Group issues by layer and file
      const issuesByLayer: Record<number, any[]> = {};

      allResults.forEach(({ file, result }) => {
        if (result.analysis?.detectedIssues) {
          result.analysis.detectedIssues.forEach((issue: any) => {
            const layer = issue.layer || 1;
            if (!issuesByLayer[layer]) {
              issuesByLayer[layer] = [];
            }
            issuesByLayer[layer].push({ ...issue, file });
          });
        }
      });

      console.log(chalk.white("Issues by Layer:"));
      for (const layer of aggregatedResult.layersUsed) {
        const layerIssues = issuesByLayer[layer] || [];
        const layerName = config.layers.config[layer]?.name || `Layer ${layer}`;
        console.log(
          chalk.gray(`  ${layerName}: `) +
            (layerIssues.length > 0
              ? chalk.yellow(`${layerIssues.length} issues`)
              : chalk.green("��� passed")),
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
              chalk.gray(
                `    ${issue.file}${location} - ${issue.message || issue.description || "Issue detected"}`,
              ),
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
        console.log(JSON.stringify(aggregatedResult, null, 2));
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
    spinner.fail("Analysis initialization failed");
    console.log(
      chalk.red(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}
