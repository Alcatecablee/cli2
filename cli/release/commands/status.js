"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = statusCommand;
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../utils/config");
const retry_1 = require("../utils/retry");
async function statusCommand(options) {
    console.log(chalk_1.default.white.bold("NeuroLint Project Status\n"));
    try {
        // Check configuration
        const configPath = path_1.default.join(process.cwd(), ".neurolint.json");
        const hasConfig = await fs_extra_1.default.pathExists(configPath);
        console.log(chalk_1.default.white("Configuration:"));
        if (hasConfig) {
            console.log(`${chalk_1.default.white("PASS")} Configuration file found: .neurolint.json`);
            const config = await (0, config_1.loadConfig)();
            console.log(`${chalk_1.default.white("  API URL:")} ${config.api.url}`);
            console.log(`${chalk_1.default.white("  Enabled Layers:")} ${config.layers.enabled.join(", ")}`);
            console.log(`${chalk_1.default.white("  Output Format:")} ${config.output.format}`);
            if (config.apiKey) {
                console.log(`${chalk_1.default.white("PASS")} API key configured`);
            }
            else {
                console.log(`${chalk_1.default.white("WARN")} No API key configured (run: neurolint login)`);
            }
        }
        else {
            console.log(`${chalk_1.default.white("WARN")} No configuration found (run: neurolint init)`);
        }
        // Check project structure
        console.log(chalk_1.default.white("\nProject Structure:"));
        const packageJsonPath = path_1.default.join(process.cwd(), "package.json");
        if (await fs_extra_1.default.pathExists(packageJsonPath)) {
            const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
            console.log(`${chalk_1.default.white("PASS")} package.json found`);
            const deps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies,
            };
            if (deps.typescript) {
                console.log(`${chalk_1.default.white("PASS")} TypeScript project detected`);
            }
            if (deps.react) {
                console.log(`${chalk_1.default.white("PASS")} React project detected`);
            }
            if (deps.next) {
                console.log(`${chalk_1.default.white("PASS")} Next.js project detected`);
            }
        }
        // Check for TypeScript config
        const tsconfigPath = path_1.default.join(process.cwd(), "tsconfig.json");
        if (await fs_extra_1.default.pathExists(tsconfigPath)) {
            console.log(`${chalk_1.default.white("PASS")} tsconfig.json found`);
        }
        // Scan for files
        const { glob } = await Promise.resolve().then(() => __importStar(require("glob")));
        const jsFiles = await glob("**/*.{js,jsx}", {
            ignore: ["node_modules/**", "dist/**", "build/**"],
        });
        const tsFiles = await glob("**/*.{ts,tsx}", {
            ignore: ["node_modules/**", "dist/**", "build/**"],
        });
        console.log(chalk_1.default.white("\nFile Statistics:"));
        console.log(`${chalk_1.default.white("  JavaScript files:")} ${jsFiles.length}`);
        console.log(`${chalk_1.default.white("  TypeScript files:")} ${tsFiles.length}`);
        console.log(`${chalk_1.default.white("  Total files:")} ${jsFiles.length + tsFiles.length}`);
        if (options.detailed) {
            console.log(chalk_1.default.white("\nDetailed Analysis:"));
            // Analyze file extensions
            const extensions = {};
            [...jsFiles, ...tsFiles].forEach((file) => {
                const ext = path_1.default.extname(file);
                extensions[ext] = (extensions[ext] || 0) + 1;
            });
            Object.entries(extensions).forEach(([ext, count]) => {
                console.log(`${chalk_1.default.white(`  ${ext} files:`)} ${count}`);
            });
            // Check for common patterns
            console.log(chalk_1.default.white("\nCommon Patterns:"));
            const componentFiles = [...jsFiles, ...tsFiles].filter((f) => f.includes("component") ||
                f.includes("Component") ||
                /\/[A-Z]/.test(f));
            console.log(`${chalk_1.default.white("  Component files:")} ${componentFiles.length}`);
            const testFiles = [...jsFiles, ...tsFiles].filter((f) => f.includes(".test.") ||
                f.includes(".spec.") ||
                f.includes("__tests__"));
            console.log(`${chalk_1.default.white("  Test files:")} ${testFiles.length}`);
        }
        // Health check with retry logic
        console.log(chalk_1.default.white("\nHealth Check:"));
        try {
            const axios = await Promise.resolve().then(() => __importStar(require("axios")));
            const config = await (0, config_1.loadConfig)();
            await (0, retry_1.withRetry)(async () => {
                const response = await axios.default.get(`${config.api?.url || "https://neurolint.dev/api"}/health`, {
                    timeout: 5000,
                });
                if (response.status === 200) {
                    console.log(`${chalk_1.default.white("PASS")} NeuroLint API is accessible`);
                    if (response.data?.version) {
                        console.log(`${chalk_1.default.white("  Version:")} ${response.data.version}`);
                    }
                    if (response.data?.status) {
                        console.log(`${chalk_1.default.white("  Status:")} ${response.data.status}`);
                    }
                }
            }, {
                maxAttempts: 2,
                delay: 1000,
            });
            // Test authentication if API key is configured
            if (config.apiKey) {
                try {
                    const authResponse = await axios.default.get(`${config.api?.url || "https://neurolint.dev/api"}/auth/verify`, {
                        headers: { Authorization: `Bearer ${config.apiKey}` },
                        timeout: 5000,
                    });
                    if (authResponse.status === 200) {
                        console.log(`${chalk_1.default.white("PASS")} Authentication is valid`);
                    }
                }
                catch (authError) {
                    console.log(`${chalk_1.default.white("FAIL")} Authentication failed`);
                    console.log(`${chalk_1.default.gray('  Run "neurolint login" to re-authenticate')}`);
                }
            }
        }
        catch (error) {
            console.log(`${chalk_1.default.white("FAIL")} NeuroLint API is not accessible`);
            if (error instanceof Error) {
                if (error.message.includes("ECONNREFUSED")) {
                    console.log(`${chalk_1.default.gray("  Make sure the server is running: npm run dev")}`);
                }
                else if (error.message.includes("ENOTFOUND")) {
                    console.log(`${chalk_1.default.gray("  Check the API URL in your configuration")}`);
                }
                else {
                    console.log(`${chalk_1.default.gray(`  Error: ${error.message}`)}`);
                }
            }
        }
        // Recommendations
        console.log(chalk_1.default.white("\nRecommendations:"));
        if (!hasConfig) {
            console.log(`${chalk_1.default.white("•")} Run ${chalk_1.default.white("neurolint init")} to set up configuration`);
        }
        const config = await (0, config_1.loadConfig)();
        if (!config.apiKey) {
            console.log(`${chalk_1.default.white("•")} Run ${chalk_1.default.white("neurolint login")} to authenticate`);
        }
        if (jsFiles.length + tsFiles.length > 0) {
            console.log(`${chalk_1.default.white("•")} Run ${chalk_1.default.white("neurolint analyze")} to check your code`);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Status check failed: ${error instanceof Error ? error.message : "Unknown error"}`));
    }
}
