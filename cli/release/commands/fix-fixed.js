"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixCommand = fixCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const glob_1 = require("glob");
const config_1 = require("../utils/config");
async function fixCommand(files, options) {
    const spinner = (0, ora_1.default)("Initializing NeuroLint fixes...").start();
    const startTime = Date.now();
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
                const userResponse = await axios_1.default.get(`${config.api.url}/auth/user`, {
                    headers: { "X-API-Key": config.apiKey },
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
        // Determine files to fix
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
            spinner.fail("No files found to fix");
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
        // Create backup directory if needed
        let backupDir;
        if (options.backup ||
            (!options.dryRun && !process.env.NEUROLINT_NO_BACKUP)) {
            backupDir = path_1.default.join(process.cwd(), ".neurolint-backups", new Date().toISOString().split("T")[0]);
            if (!options.dryRun) {
                await fs_extra_1.default.ensureDir(backupDir);
            }
        }
        if (options.dryRun) {
            spinner.text = `Previewing fixes for ${existingFiles.length} files...`;
        }
        else {
            spinner.text = `Applying fixes to ${existingFiles.length} files with layers [${layers.join(", ")}]...`;
        }
        // Process files one by one since the API expects single files
        const allResults = [];
        let totalFixed = 0;
        let filesModified = 0;
        for (const file of existingFiles) {
            try {
                const code = await fs_extra_1.default.readFile(file, "utf-8");
                // Create backup if needed
                if (backupDir && !options.dryRun) {
                    const backupPath = path_1.default.join(backupDir, file);
                    await fs_extra_1.default.ensureDir(path_1.default.dirname(backupPath));
                    await fs_extra_1.default.copy(file, backupPath);
                }
                // Send fix request for single file
                const fixPayload = {
                    code,
                    filename: file,
                    layers: layers.join(","),
                    applyFixes: !options.dryRun, // Apply fixes unless it's a dry run
                    metadata: {
                        recursive: options.recursive,
                        backup: !!backupDir,
                        dryRun: options.dryRun,
                    },
                };
                const response = await axios_1.default.post(`${config.api.url}/analyze`, fixPayload, {
                    headers: {
                        "X-API-Key": config.apiKey,
                        "Content-Type": "application/json",
                    },
                    timeout: config.api.timeout,
                });
                const result = response.data;
                // If fixes were applied and we have the fixed code, write it back
                if (!options.dryRun && result.fixedCode && result.fixedCode !== code) {
                    await fs_extra_1.default.writeFile(file, result.fixedCode, "utf-8");
                    filesModified++;
                }
                allResults.push({ file, result });
                totalFixed +=
                    result.analysis?.detectedIssues?.filter((issue) => issue.fixed)
                        ?.length || 0;
            }
            catch (fileError) {
                console.log(chalk_1.default.yellow(`Warning: Could not fix ${file}`));
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
        if (options.dryRun) {
            spinner.succeed(`Fix preview completed for ${existingFiles.length} files`);
        }
        else {
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
            console.log(chalk_1.default.white.bold("Fix Preview Results"));
        }
        else {
            console.log(chalk_1.default.white.bold("Fix Results"));
        }
        console.log();
        console.log(chalk_1.default.white("Files processed: ") + chalk_1.default.cyan(existingFiles.length));
        if (!options.dryRun) {
            console.log(chalk_1.default.white("Files modified: ") +
                chalk_1.default.cyan(aggregatedResult.filesModified));
        }
        console.log(chalk_1.default.white("Issues fixed: ") +
            (aggregatedResult.issuesFixed > 0
                ? chalk_1.default.green(aggregatedResult.issuesFixed)
                : chalk_1.default.yellow("0")));
        console.log(chalk_1.default.white("Layers used: ") +
            chalk_1.default.gray(`[${aggregatedResult.layersUsed.join(", ")}]`));
        console.log(chalk_1.default.white("Duration: ") +
            chalk_1.default.gray(`${aggregatedResult.performance.duration}ms`));
        if (backupDir && !options.dryRun) {
            console.log(chalk_1.default.white("Backups saved to: ") + chalk_1.default.gray(backupDir));
        }
        console.log();
        if (aggregatedResult.issuesFixed > 0) {
            // Show summary of fixes by layer
            const fixesByLayer = {};
            allResults.forEach(({ file, result }) => {
                if (result.analysis?.detectedIssues) {
                    result.analysis.detectedIssues.forEach((issue) => {
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
            console.log(chalk_1.default.white("Fixes by Layer:"));
            for (const layer of aggregatedResult.layersUsed) {
                const layerFixes = fixesByLayer[layer] || [];
                const layerName = config.layers.config[layer]?.name || `Layer ${layer}`;
                console.log(chalk_1.default.gray(`  ${layerName}: `) +
                    (layerFixes.length > 0
                        ? chalk_1.default.green(`${layerFixes.length} fixes applied`)
                        : chalk_1.default.gray("no fixes")));
            }
            console.log();
            if (options.dryRun) {
                console.log(chalk_1.default.white("Next steps:"));
                console.log(chalk_1.default.gray("  • Run 'neurolint fix' without --dry-run to apply fixes"));
                console.log(chalk_1.default.gray("  • Add --backup to create backup files"));
            }
            else {
                console.log(chalk_1.default.green("Fixes applied successfully!"));
                console.log(chalk_1.default.gray("  • Run 'neurolint analyze' to verify the fixes"));
            }
        }
        else {
            if (options.dryRun) {
                console.log(chalk_1.default.gray("No fixes would be applied."));
            }
            else {
                console.log(chalk_1.default.gray("No fixes were needed."));
            }
        }
    }
    catch (error) {
        spinner.fail("Fix operation failed");
        console.log(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
}
