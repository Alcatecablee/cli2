"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCommand = analyzeCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const glob_1 = require("glob");
const fs_extra_1 = __importDefault(require("fs-extra"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
async function analyzeCommand(files, options) {
    const spinner = (0, ora_1.default)("Initializing NeuroLint analysis...").start();
    try {
        // Load and validate configuration
        const config = await (0, config_1.loadConfig)(options.config);
        const configValidation = await (0, config_1.validateConfig)(config);
        if (!configValidation.valid) {
            spinner.fail("Configuration validation failed");
            configValidation.errors.forEach((error) => console.log(chalk_1.default.red(`ERROR: ${error}`)));
            return;
        }
        // Check authentication
        if (!config.apiKey) {
            spinner.fail("Authentication required");
            console.log(chalk_1.default.yellow('Run "neurolint login" to authenticate first'));
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
                const userResponse = await axios_1.default.get(`${config.api.url}/api/user/profile`, {
                    headers: { Authorization: `Bearer ${config.apiKey}` },
                    timeout: 10000,
                });
                const plan = userResponse.data.plan || "free";
                if (plan === "free" && premiumLayers.length > 0) {
                    spinner.fail("Premium features required");
                    console.log(chalk_1.default.yellow(`Layers ${premiumLayers.join(", ")} require Pro plan ($24.99/month)`));
                    console.log(chalk_1.default.gray("Upgrade at: https://neurolint.dev/pricing"));
                    return;
                }
            }
            catch (error) {
                console.log(chalk_1.default.yellow("Unable to verify premium features, continuing..."));
            }
        }
        // Determine files to analyze
        let targetFiles = [];
        if (files.length > 0) {
            targetFiles = files;
        }
        else {
            // Use glob patterns from config
            spinner.text = "Discovering files...";
            try {
                for (const pattern of config.files.include) {
                    const foundFiles = await (0, glob_1.glob)(pattern, {
                        ignore: config.files.exclude,
                        cwd: process.cwd(),
                    });
                    targetFiles.push(...foundFiles);
                }
            }
            catch (error) {
                spinner.fail("File discovery failed");
                console.log(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
                return;
            }
        }
        if (targetFiles.length === 0) {
            spinner.fail("No files found to analyze");
            console.log(chalk_1.default.yellow("Try specifying files explicitly or check your include/exclude patterns"));
            return;
        }
        // Remove duplicates and filter existing files
        targetFiles = [...new Set(targetFiles)];
        const existingFiles = [];
        for (const file of targetFiles) {
            if (await fs_extra_1.default.pathExists(file)) {
                existingFiles.push(file);
            }
        }
        if (existingFiles.length === 0) {
            spinner.fail("No valid files found");
            return;
        }
        spinner.text = `Analyzing ${existingFiles.length} files with layers [${layers.join(", ")}]...`;
        // Read file contents
        const fileContents = {};
        for (const file of existingFiles) {
            try {
                fileContents[file] = await fs_extra_1.default.readFile(file, "utf-8");
            }
            catch (error) {
                console.log(chalk_1.default.yellow(`Warning: Could not read ${file}`));
            }
        }
        // Send analysis request to your API
        const analysisPayload = {
            files: fileContents,
            layers: layers,
            options: {
                recursive: options.recursive,
                outputFormat: options.output || config.output.format,
                verbose: config.output.verbose,
            },
        };
        try {
            const response = await axios_1.default.post(`${config.api.url}/api/analyze`, analysisPayload, {
                headers: {
                    Authorization: `Bearer ${config.apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: config.api.timeout,
            });
            const result = response.data;
            spinner.succeed("Analysis completed");
            // Display results
            console.log();
            console.log(chalk_1.default.white.bold("Analysis Results"));
            console.log();
            console.log(chalk_1.default.white("Files analyzed: ") + chalk_1.default.cyan(result.filesAnalyzed));
            console.log(chalk_1.default.white("Issues found: ") +
                (result.issuesFound > 0
                    ? chalk_1.default.yellow(result.issuesFound)
                    : chalk_1.default.green("0")));
            console.log(chalk_1.default.white("Layers used: ") +
                chalk_1.default.gray(`[${result.layersUsed.join(", ")}]`));
            console.log(chalk_1.default.white("Duration: ") +
                chalk_1.default.gray(`${result.performance.duration}ms`));
            console.log();
            if (result.issuesFound > 0) {
                // Group issues by layer
                const issuesByLayer = {};
                result.issues.forEach((issue) => {
                    if (!issuesByLayer[issue.layer]) {
                        issuesByLayer[issue.layer] = [];
                    }
                    issuesByLayer[issue.layer].push(issue);
                });
                console.log(chalk_1.default.white("Issues by Layer:"));
                for (const layer of result.layersUsed) {
                    const layerIssues = issuesByLayer[layer] || [];
                    const layerName = config.layers.config[layer]?.name || `Layer ${layer}`;
                    console.log(chalk_1.default.gray(`  ${layerName}: `) +
                        (layerIssues.length > 0
                            ? chalk_1.default.yellow(`${layerIssues.length} issues`)
                            : chalk_1.default.green("✓ passed")));
                    // Show first few issues for each layer
                    if (layerIssues.length > 0 &&
                        (options.output === "table" || !options.output)) {
                        layerIssues.slice(0, 3).forEach((issue) => {
                            const location = issue.line
                                ? `:${issue.line}${issue.column ? `:${issue.column}` : ""}`
                                : "";
                            console.log(chalk_1.default.gray(`    ${issue.file}${location} - ${issue.message}`));
                        });
                        if (layerIssues.length > 3) {
                            console.log(chalk_1.default.gray(`    ... and ${layerIssues.length - 3} more`));
                        }
                    }
                }
                console.log();
                // Output formatted results if requested
                if (options.output === "json") {
                    console.log(JSON.stringify(result, null, 2));
                }
                console.log(chalk_1.default.white("Next steps:"));
                console.log(chalk_1.default.gray("  • Run 'neurolint fix' to automatically fix issues"));
                console.log(chalk_1.default.gray("  • Run 'neurolint analyze --output=json' for detailed results"));
            }
            else {
                console.log(chalk_1.default.green("No issues found! Your code looks great."));
            }
        }
        catch (error) {
            spinner.fail("Analysis failed");
            if (axios_1.default.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    console.log(chalk_1.default.red("Authentication failed. Please run 'neurolint login' again."));
                }
                else if (error.response?.status === 403) {
                    console.log(chalk_1.default.red("Access denied. Check your API permissions."));
                }
                else if (error.code === "ECONNREFUSED") {
                    console.log(chalk_1.default.red(`Cannot connect to NeuroLint API at ${config.api.url}`));
                    console.log(chalk_1.default.gray("Make sure the NeuroLint server is running."));
                }
                else {
                    console.log(chalk_1.default.red(`API Error: ${error.response?.status} ${error.response?.statusText}`));
                    if (error.response?.data?.message) {
                        console.log(chalk_1.default.gray(error.response.data.message));
                    }
                }
            }
            else {
                console.log(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
            }
        }
    }
    catch (error) {
        spinner.fail("Analysis initialization failed");
        console.log(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
}
