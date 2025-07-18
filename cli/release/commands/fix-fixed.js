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
const config_1 = require("../utils/config");
async function fixCommand(files, options) {
    const spinner = (0, ora_1.default)("Preparing to fix code issues...").start();
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
        // Determine files to fix
        let targetFiles = [];
        if (files.length > 0) {
            targetFiles = files;
        }
        else {
            // Use current directory
            targetFiles = ["src/"];
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
            spinner.text = "Previewing potential fixes...";
        }
        else {
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
            const response = await axios_1.default.post(`${config.api.url}/api/fix`, fixPayload, {
                headers: {
                    Authorization: `Bearer ${config.apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: config.api.timeout,
            });
            const result = response.data;
            spinner.succeed(options.dryRun ? "Fix preview completed" : "Fixes applied successfully");
            // Display results
            console.log();
            if (options.dryRun) {
                console.log(chalk_1.default.white.bold("Fix Preview"));
                console.log();
                console.log(chalk_1.default.white("Files that would be modified: ") +
                    chalk_1.default.cyan(result.filesModified));
                console.log(chalk_1.default.white("Total fixes: ") + chalk_1.default.green(result.issuesFixed));
                console.log(chalk_1.default.white("Layers used: ") +
                    chalk_1.default.gray(`[${result.layersUsed.join(", ")}]`));
                console.log();
                if (result.fixes.length > 0) {
                    console.log(chalk_1.default.white("Preview of fixes:"));
                    const fixesByLayer = {};
                    result.fixes.forEach((fix) => {
                        if (!fixesByLayer[fix.layer]) {
                            fixesByLayer[fix.layer] = [];
                        }
                        fixesByLayer[fix.layer].push(fix);
                    });
                    for (const layer of result.layersUsed) {
                        const layerFixes = fixesByLayer[layer] || [];
                        if (layerFixes.length > 0) {
                            const layerName = config.layers.config[layer]?.name || `Layer ${layer}`;
                            console.log(chalk_1.default.gray(`  ${layerName}: ${layerFixes.length} fixes`));
                            // Show first few fixes
                            layerFixes.slice(0, 3).forEach((fix) => {
                                console.log(chalk_1.default.gray(`    ${fix.file}:${fix.line} - ${fix.description}`));
                            });
                            if (layerFixes.length > 3) {
                                console.log(chalk_1.default.gray(`    ... and ${layerFixes.length - 3} more`));
                            }
                        }
                    }
                }
                console.log();
                console.log(chalk_1.default.gray("Run without --dry-run to apply these fixes"));
            }
            else {
                console.log(chalk_1.default.white.bold("Fixes Applied"));
                console.log();
                console.log(chalk_1.default.white("Files modified: ") + chalk_1.default.cyan(result.filesModified));
                console.log(chalk_1.default.white("Issues fixed: ") + chalk_1.default.green(result.issuesFixed));
                console.log(chalk_1.default.white("Layers used: ") +
                    chalk_1.default.gray(`[${result.layersUsed.join(", ")}]`));
                if (backupDir && result.backupDir) {
                    console.log(chalk_1.default.white("Backups created: ") + chalk_1.default.gray(result.backupDir));
                }
                console.log();
                if (result.issuesFixed > 0) {
                    console.log(chalk_1.default.green("Your code has been improved!"));
                    console.log();
                    console.log(chalk_1.default.white("Summary of fixes:"));
                    // Group fixes by layer
                    const fixesByLayer = {};
                    result.fixes.forEach((fix) => {
                        fixesByLayer[fix.layer] = (fixesByLayer[fix.layer] || 0) + 1;
                    });
                    for (const layer of result.layersUsed) {
                        const count = fixesByLayer[layer] || 0;
                        if (count > 0) {
                            const layerName = config.layers.config[layer]?.name || `Layer ${layer}`;
                            console.log(chalk_1.default.gray(`  ${layerName}: ${count} fixes applied`));
                        }
                    }
                    console.log();
                    console.log(chalk_1.default.white("Next steps:"));
                    console.log(chalk_1.default.gray("  • Review the changes in your files"));
                    console.log(chalk_1.default.gray("  • Run your tests to ensure everything works"));
                    console.log(chalk_1.default.gray("  • Run 'neurolint analyze' to check for remaining issues"));
                }
                else {
                    console.log(chalk_1.default.green("No fixes were needed - your code is already optimized!"));
                }
            }
        }
        catch (error) {
            spinner.fail(options.dryRun ? "Fix preview failed" : "Fix process failed");
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
        spinner.fail("Fix initialization failed");
        console.log(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
}
