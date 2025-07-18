"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiConnection = validateApiConnection;
exports.validateFiles = validateFiles;
exports.validateSingleFile = validateSingleFile;
exports.validateLayerNumbers = validateLayerNumbers;
exports.validateOutputFormat = validateOutputFormat;
exports.validateApiUrl = validateApiUrl;
exports.createFileValidator = createFileValidator;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const glob_1 = require("glob");
// Add missing validateApiConnection function
async function validateApiConnection(config) {
    if (!config.apiKey) {
        throw new Error("API key not configured");
    }
    if (!config.apiUrl) {
        throw new Error("API URL not configured");
    }
    try {
        const response = await fetch(`${config.apiUrl}/api/health`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        if (!response.ok) {
            throw new Error(`API connection failed: ${response.status} ${response.statusText}`);
        }
        return true;
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === "TimeoutError") {
                throw new Error("API connection timeout - check your network connection");
            }
            throw new Error(`API connection failed: ${error.message}`);
        }
        throw new Error("Unknown API connection error");
    }
}
async function validateFiles(patterns, options = {}) {
    const { maxFileSize = 10 * 1024 * 1024, // 10MB default
    allowedExtensions = [".ts", ".tsx", ".js", ".jsx"], minFiles = 0, maxFiles = 1000, } = options;
    const errors = [];
    const warnings = [];
    const files = [];
    try {
        // Resolve file patterns
        for (const pattern of patterns) {
            const matches = await (0, glob_1.glob)(pattern, {
                ignore: ["node_modules/**", "dist/**", "build/**", ".next/**"],
                absolute: true,
            });
            files.push(...matches);
        }
        // Remove duplicates
        const uniqueFiles = [...new Set(files)];
        // Check file count
        if (uniqueFiles.length < minFiles) {
            errors.push(`Minimum ${minFiles} files required, found ${uniqueFiles.length}`);
        }
        if (uniqueFiles.length > maxFiles) {
            errors.push(`Maximum ${maxFiles} files allowed, found ${uniqueFiles.length}`);
        }
        // Validate each file
        for (const filePath of uniqueFiles.slice(0, maxFiles)) {
            const fileErrors = await validateSingleFile(filePath, {
                maxFileSize,
                allowedExtensions,
            });
            errors.push(...fileErrors.errors);
            warnings.push(...fileErrors.warnings);
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            files: uniqueFiles.slice(0, maxFiles),
        };
    }
    catch (error) {
        return {
            valid: false,
            errors: [
                `File validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            ],
            warnings: [],
            files: [],
        };
    }
}
async function validateSingleFile(filePath, options = {}) {
    const { maxFileSize = 10 * 1024 * 1024, allowedExtensions = [".ts", ".tsx", ".js", ".jsx"], } = options;
    const errors = [];
    const warnings = [];
    try {
        // Check if file exists
        if (!(await fs_extra_1.default.pathExists(filePath))) {
            errors.push(`File does not exist: ${filePath}`);
            return { valid: false, errors, warnings };
        }
        // Check file extension
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            warnings.push(`Unsupported file extension: ${ext} (${filePath})`);
        }
        // Check file size
        const stats = await fs_extra_1.default.stat(filePath);
        if (stats.size > maxFileSize) {
            errors.push(`File too large: ${filePath} (${formatBytes(stats.size)} > ${formatBytes(maxFileSize)})`);
        }
        // Check if file is readable
        try {
            await fs_extra_1.default.access(filePath, fs_extra_1.default.constants.R_OK);
        }
        catch {
            errors.push(`File is not readable: ${filePath}`);
        }
        // Basic content validation
        if (stats.size > 0) {
            try {
                const content = await fs_extra_1.default.readFile(filePath, "utf-8");
                // Check for binary content
                if (containsBinaryContent(content)) {
                    warnings.push(`File appears to contain binary content: ${filePath}`);
                }
                // Check for extremely long lines (potential minified files)
                const lines = content.split("\n");
                const longLines = lines.filter((line) => line.length > 1000);
                if (longLines.length > 0) {
                    warnings.push(`File contains very long lines (possible minified): ${filePath}`);
                }
            }
            catch (error) {
                if (error instanceof Error && error.message.includes("EMFILE")) {
                    warnings.push(`Too many open files, skipping content validation for: ${filePath}`);
                }
                else {
                    errors.push(`Cannot read file content: ${filePath}`);
                }
            }
        }
    }
    catch (error) {
        errors.push(`File validation error: ${filePath} - ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    return { valid: errors.length === 0, errors, warnings };
}
function validateLayerNumbers(layers) {
    const errors = [];
    let layerArray;
    if (typeof layers === "string") {
        layerArray = layers.split(",").map((l) => parseInt(l.trim(), 10));
    }
    else {
        layerArray = layers;
    }
    // Check for invalid numbers
    const invalidLayers = layerArray.filter((layer) => !Number.isInteger(layer) || layer < 1 || layer > 6);
    if (invalidLayers.length > 0) {
        errors.push(`Invalid layer numbers: ${invalidLayers.join(", ")}. Must be integers between 1-6.`);
    }
    // Check for duplicates
    const uniqueLayers = [...new Set(layerArray)];
    if (uniqueLayers.length !== layerArray.length) {
        errors.push("Duplicate layer numbers are not allowed");
    }
    return { valid: errors.length === 0, errors, warnings: [] };
}
function validateOutputFormat(format) {
    const validFormats = ["table", "json", "summary"];
    const errors = [];
    if (!validFormats.includes(format)) {
        errors.push(`Invalid output format: ${format}. Must be one of: ${validFormats.join(", ")}`);
    }
    return { valid: errors.length === 0, errors, warnings: [] };
}
function validateApiUrl(url) {
    const errors = [];
    try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            errors.push("API URL must use http or https protocol");
        }
        if (!parsed.hostname) {
            errors.push("API URL must have a valid hostname");
        }
    }
    catch {
        errors.push("Invalid API URL format");
    }
    return { valid: errors.length === 0, errors, warnings: [] };
}
function containsBinaryContent(content) {
    // Check for null bytes or other binary indicators
    return (content.includes("\0") ||
        /[\x00-\x08\x0E-\x1F\x7F]/.test(content.substring(0, 1000)));
}
function formatBytes(bytes) {
    if (bytes === 0)
        return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
function createFileValidator(options = {}) {
    return {
        async validateFiles(patterns) {
            return validateFiles(patterns, options);
        },
        async validateSingleFile(filePath) {
            return validateSingleFile(filePath, options);
        },
    };
}
