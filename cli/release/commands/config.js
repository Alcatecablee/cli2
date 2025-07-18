"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = configCommand;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../utils/config");
const validation_1 = require("../utils/validation");
function getConfigValue(config, key) {
    if (key.includes(".")) {
        const keys = key.split(".");
        let current = config;
        for (const k of keys) {
            current = current?.[k];
            if (current === undefined)
                return undefined;
        }
        return current;
    }
    else {
        return config[key];
    }
}
function setConfigValue(config, key, value) {
    if (key.includes(".")) {
        const keys = key.split(".");
        let current = config;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]])
                current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }
    else {
        config[key] = value;
    }
}
async function configCommand(options) {
    try {
        const config = await (0, config_1.loadConfig)();
        if (options.list) {
            console.log(chalk_1.default.white.bold("\nNeuroLint Configuration:\n"));
            console.log(chalk_1.default.white("API URL:"), chalk_1.default.gray(config.api?.url || "Not set"));
            console.log(chalk_1.default.white("API Key:"), chalk_1.default.gray(config.apiKey ? "***" + config.apiKey.slice(-4) : "Not set"));
            console.log(chalk_1.default.white("Enabled Layers:"), chalk_1.default.gray(config.layers?.enabled?.join(",") || "1,2,3,4"));
            console.log(chalk_1.default.white("Output Format:"), chalk_1.default.gray(config.output?.format || "table"));
            return;
        }
        if (options.get) {
            const value = getConfigValue(config, options.get);
            if (value !== undefined) {
                console.log(chalk_1.default.white(value));
            }
            else {
                console.log(chalk_1.default.white(`Configuration key "${options.get}" not found`));
            }
            return;
        }
        if (options.set) {
            const [key, value] = options.set.split("=");
            if (!key || !value) {
                console.log(chalk_1.default.white("Invalid format. Use: --set key=value"));
                return;
            }
            // Validate specific configuration values
            if (key === "apiUrl" || key === "api.url") {
                const urlValidation = (0, validation_1.validateApiUrl)(value);
                if (!urlValidation.valid) {
                    console.log(chalk_1.default.white(`ERROR: ${urlValidation.errors[0]}`));
                    return;
                }
            }
            // Build nested configuration object if needed
            let newConfig = { ...config };
            setConfigValue(newConfig, key, value);
            // Validate the entire configuration
            const configValidation = await (0, config_1.validateConfig)(newConfig);
            if (!configValidation.valid) {
                console.log(chalk_1.default.white("Configuration validation failed:"));
                configValidation.errors.forEach((error) => console.log(chalk_1.default.white(`  ${error}`)));
                return;
            }
            await (0, config_1.saveConfig)(newConfig);
            console.log(chalk_1.default.white(`Set ${key} = ${value}`));
            if (configValidation.errors.length > 0) {
                console.log(chalk_1.default.white("Configuration warnings:"));
                configValidation.errors.forEach((warning) => console.log(chalk_1.default.white(`  ${warning}`)));
            }
            return;
        }
        if (options.reset) {
            await (0, config_1.saveConfig)({
                api: { url: "https://api.neurolint.dev", timeout: 60000 },
                apiKey: "",
                layers: { enabled: [1, 2, 3, 4], config: {} },
                output: { format: "table", verbose: false },
            });
            console.log(chalk_1.default.white("Configuration reset to defaults"));
            return;
        }
        // Default: show help
        console.log(chalk_1.default.white.bold("\nConfiguration Management:\n"));
        console.log(chalk_1.default.white("neurolint config --list"), chalk_1.default.gray("# Show all configuration"));
        console.log(chalk_1.default.white("neurolint config --get apiUrl"), chalk_1.default.gray("# Get specific value"));
        console.log(chalk_1.default.white("neurolint config --set apiUrl=https://api.neurolint.dev"), chalk_1.default.gray("# Set value"));
        console.log(chalk_1.default.white("neurolint config --reset"), chalk_1.default.gray("# Reset to defaults"));
    }
    catch (error) {
        console.error(chalk_1.default.white("Configuration error:"), error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
