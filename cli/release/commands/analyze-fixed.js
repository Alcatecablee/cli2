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
/**
 * Layer Dependency Management (from IMPLEMENTATION_PATTERNS.md)
 * Validates and corrects layer selection based on dependencies
 */
function validateAndCorrectLayers(requestedLayers) {
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
    const warnings = [];
    const autoAdded = [];
    let correctedLayers = [...requestedLayers];
    // Sort layers in execution order
    correctedLayers.sort((a, b) => a - b);
    // Check dependencies for each requested layer
    for (const layerId of requestedLayers) {
        const dependencies = DEPENDENCIES[layerId] || [];
        const missingDeps = dependencies.filter((dep) => !correctedLayers.includes(dep));
        if (missingDeps.length > 0) {
            // Auto-add missing dependencies
            correctedLayers.push(...missingDeps);
            autoAdded.push(...missingDeps);
            warnings.push(`Layer ${layerId} (${LAYER_INFO[layerId]?.name}) requires ` +
                `${missingDeps.map((dep) => `${dep} (${LAYER_INFO[dep]?.name})`).join(", ")}. ` +
                `Auto-added missing dependencies.`);
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
async function analyzeCommand(files, options) {
    const spinner = (0, ora_1.default)("Initializing NeuroLint analysis...").start();
    const startTime = Date.now();
    try {
        // Input validation
        if (files.some((file) => !file || typeof file !== "string")) {
            spinner.fail("Invalid file paths provided");
            console.log(chalk_1.default.red("ERROR: All file paths must be valid strings"));
            return;
        }
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
            layerValidation.warnings.forEach((warning) => console.log(chalk_1.default.yellow(`DEPENDENCY: ${warning}`)));
        }
        // Check premium features for layers 5 and 6
        const premiumLayers = layers.filter((layer) => layer >= 5);
        if (premiumLayers.length > 0) {
            try {
                const userResponse = await axios_1.default.get(`${config.api.url}/auth/api-keys`, {
                    headers: { "X-API-Key": config.apiKey },
                    timeout: 10000,
                });
                // Handle different response structures from API
                const plan = userResponse.data.plan ||
                    userResponse.data.user?.plan ||
                    userResponse.data.apiKey?.plan ||
                    "free";
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
        // Process files one by one since the API expects single files
        const allResults = [];
        let totalIssues = 0;
        for (const file of existingFiles) {
            try {
                const code = await fs_extra_1.default.readFile(file, "utf-8");
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
                const response = await axios_1.default.post(`${config.api.url}/analyze`, analysisPayload, {
                    headers: {
                        "X-API-Key": config.apiKey,
                        "Content-Type": "application/json",
                    },
                    timeout: config.api.timeout,
                });
                const result = response.data;
                // Basic validation following IMPLEMENTATION_PATTERNS.md
                if (!result || typeof result !== "object") {
                    console.log(chalk_1.default.yellow(`Warning: Invalid response for ${file}`));
                    continue;
                }
                allResults.push({ file, result });
                // Handle different response structures
                const detectedIssues = result.analysis?.detectedIssues ||
                    result.detectedIssues ||
                    result.layers?.flatMap((l) => l.detectedIssues) ||
                    [];
                totalIssues += detectedIssues.length;
            }
            catch (fileError) {
                console.log(chalk_1.default.yellow(`Warning: Could not analyze ${file}`));
                if (axios_1.default.isAxiosError(fileError)) {
                    if (fileError.response?.status === 401) {
                        console.log(chalk_1.default.red("Authentication failed. Please run 'neurolint login' again."));
                    }
                    else if (fileError.response?.status === 403) {
                        console.log(chalk_1.default.red("Access denied. Check your API permissions."));
                    }
                    else {
                        console.log(chalk_1.default.gray(`API Error: ${fileError.response?.status} ${fileError.response?.statusText}`));
                    }
                }
                else {
                    console.log(chalk_1.default.gray(`Error: ${fileError instanceof Error ? fileError.message : String(fileError)}`));
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
        console.log(chalk_1.default.white.bold("Analysis Results"));
        console.log();
        console.log(chalk_1.default.white("Files analyzed: ") +
            chalk_1.default.cyan(aggregatedResult.filesAnalyzed));
        console.log(chalk_1.default.white("Issues found: ") +
            (aggregatedResult.issuesFound > 0
                ? chalk_1.default.yellow(aggregatedResult.issuesFound)
                : chalk_1.default.green("0")));
        console.log(chalk_1.default.white("Layers used: ") +
            chalk_1.default.gray(`[${aggregatedResult.layersUsed.join(", ")}]`));
        console.log(chalk_1.default.white("Duration: ") +
            chalk_1.default.gray(`${aggregatedResult.performance.duration}ms`));
        console.log();
        if (aggregatedResult.issuesFound > 0) {
            // Group issues by layer and file
            const issuesByLayer = {};
            allResults.forEach(({ file, result }) => {
                // Handle different response structures
                const detectedIssues = result.analysis?.detectedIssues ||
                    result.detectedIssues ||
                    result.layers?.flatMap((l) => l.detectedIssues || []) ||
                    [];
                detectedIssues.forEach((issue) => {
                    const layer = issue.layer || 1;
                    if (!issuesByLayer[layer]) {
                        issuesByLayer[layer] = [];
                    }
                    issuesByLayer[layer].push({ ...issue, file });
                });
            });
            console.log(chalk_1.default.white("Issues by Layer:"));
            for (const layer of aggregatedResult.layersUsed) {
                const layerIssues = issuesByLayer[layer] || [];
                const layerName = config.layers.config[layer]?.name || `Layer ${layer}`;
                console.log(chalk_1.default.gray(`  ${layerName}: `) +
                    (layerIssues.length > 0
                        ? chalk_1.default.yellow(`${layerIssues.length} issues`)
                        : chalk_1.default.green("��� passed")));
                // Show first few issues for each layer
                if (layerIssues.length > 0 &&
                    (options.output === "table" || !options.output)) {
                    layerIssues.slice(0, 3).forEach((issue) => {
                        const location = issue.line
                            ? `:${issue.line}${issue.column ? `:${issue.column}` : ""}`
                            : "";
                        console.log(chalk_1.default.gray(`    ${issue.file}${location} - ${issue.message || issue.description || "Issue detected"}`));
                    });
                    if (layerIssues.length > 3) {
                        console.log(chalk_1.default.gray(`    ... and ${layerIssues.length - 3} more`));
                    }
                }
            }
            console.log();
            // Output formatted results if requested
            if (options.output === "json") {
                console.log(JSON.stringify(aggregatedResult, null, 2));
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
        spinner.fail("Analysis initialization failed");
        console.log(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
}
