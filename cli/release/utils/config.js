"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.validateConfig = validateConfig;
exports.getConfigPath = getConfigPath;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function loadConfig(configPath) {
    const defaultConfig = {
        version: "1.0.0",
        layers: {
            enabled: [1, 2, 3, 4],
            config: {
                1: { name: "Configuration Validation", timeout: 30000 },
                2: { name: "Pattern & Entity Fixes", timeout: 45000 },
                3: { name: "Component Best Practices", timeout: 60000 },
                4: { name: "Hydration & SSR Guard", timeout: 45000 },
                5: { name: "Next.js Optimization", timeout: 30000, enabled: false },
                6: { name: "Quality & Performance", timeout: 30000, enabled: false },
            },
        },
        files: {
            include: ["**/*.{ts,tsx,js,jsx}"],
            exclude: [
                "node_modules/**",
                "dist/**",
                "build/**",
                ".next/**",
                "coverage/**",
            ],
        },
        output: {
            format: "table",
            verbose: false,
        },
        api: {
            url: "https://neurolint.dev/api",
            timeout: 60000,
        },
    };
    // Try multiple config file locations
    const configPaths = [
        configPath,
        path_1.default.join(process.cwd(), ".neurolint.json"),
        path_1.default.join(process.cwd(), "neurolint.config.json"),
        path_1.default.join(process.cwd(), "package.json"),
    ].filter((p) => Boolean(p));
    for (const filePath of configPaths) {
        if (await fs_extra_1.default.pathExists(filePath)) {
            try {
                const fileContent = await fs_extra_1.default.readJson(filePath);
                if (filePath.endsWith("package.json")) {
                    // Extract neurolint config from package.json
                    if (fileContent &&
                        typeof fileContent === "object" &&
                        fileContent.neurolint) {
                        return { ...defaultConfig, ...fileContent.neurolint };
                    }
                }
                else {
                    return { ...defaultConfig, ...fileContent };
                }
            }
            catch (error) {
                console.warn(`Failed to load config from ${filePath}:`, error);
            }
        }
    }
    return defaultConfig;
}
async function saveConfig(config, configPath) {
    const filePath = configPath || path_1.default.join(process.cwd(), ".neurolint.json");
    try {
        // Load existing config and merge with new values
        const existingConfig = await loadConfig(configPath);
        const mergedConfig = { ...existingConfig, ...config };
        // Ensure directory exists
        await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
        // Write configuration file
        await fs_extra_1.default.writeJson(filePath, mergedConfig, { spaces: 2 });
    }
    catch (error) {
        throw new Error(`Failed to save configuration: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
async function validateConfig(config) {
    const errors = [];
    // Validate API URL
    if (config.api?.url) {
        try {
            new URL(config.api.url);
        }
        catch {
            errors.push("Invalid API URL format");
        }
    }
    // Validate layers
    if (config.layers?.enabled) {
        const invalidLayers = config.layers.enabled.filter((layer) => !Number.isInteger(layer) || layer < 1 || layer > 6);
        if (invalidLayers.length > 0) {
            errors.push(`Invalid layer numbers: ${invalidLayers.join(", ")}. Must be integers between 1-6.`);
        }
    }
    // Validate file patterns
    if (config.files?.include && !Array.isArray(config.files.include)) {
        errors.push("files.include must be an array of glob patterns");
    }
    if (config.files?.exclude && !Array.isArray(config.files.exclude)) {
        errors.push("files.exclude must be an array of glob patterns");
    }
    // Validate output format
    if (config.output?.format &&
        !["table", "json", "summary"].includes(config.output.format)) {
        errors.push("output.format must be one of: table, json, summary");
    }
    return { valid: errors.length === 0, errors };
}
async function getConfigPath() {
    const possiblePaths = [
        path_1.default.join(process.cwd(), ".neurolint.json"),
        path_1.default.join(process.cwd(), "neurolint.config.json"),
        path_1.default.join(process.cwd(), "package.json"),
    ];
    for (const configPath of possiblePaths) {
        if (await fs_extra_1.default.pathExists(configPath)) {
            return configPath;
        }
    }
    return null;
}
