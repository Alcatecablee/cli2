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
exports.initCommand = initCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
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
        url: "http://localhost:3000/api",
        timeout: 60000,
    },
};
async function initCommand(options) {
    const configPath = path_1.default.join(process.cwd(), ".neurolint.json");
    const spinner = (0, ora_1.default)("Initializing NeuroLint configuration...").start();
    try {
        // Check if config already exists
        if ((await fs_extra_1.default.pathExists(configPath)) && !options.force) {
            spinner.stop();
            const { overwrite } = await inquirer_1.default.prompt([
                {
                    type: "confirm",
                    name: "overwrite",
                    message: "NeuroLint configuration already exists. Overwrite?",
                    default: false,
                },
            ]);
            if (!overwrite) {
                console.log(chalk_1.default.yellow("Configuration initialization cancelled."));
                return;
            }
        }
        spinner.text = "Detecting project structure...";
        // Detect project type
        const packageJsonPath = path_1.default.join(process.cwd(), "package.json");
        let projectType = "javascript";
        let framework = "none";
        if (await fs_extra_1.default.pathExists(packageJsonPath)) {
            const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
            const deps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies,
            };
            if (deps.typescript || deps["@types/node"]) {
                projectType = "typescript";
            }
            if (deps.next) {
                framework = "nextjs";
            }
            else if (deps.react) {
                framework = "react";
            }
            else if (deps.vue) {
                framework = "vue";
            }
        }
        spinner.succeed(`Detected ${projectType} project with ${framework} framework`);
        // Interactive configuration
        console.log(chalk_1.default.blue("\nLet's configure NeuroLint for your project:\n"));
        const answers = await inquirer_1.default.prompt([
            {
                type: "checkbox",
                name: "layers",
                message: "Which NeuroLint layers would you like to enable?",
                choices: [
                    {
                        name: "Layer 1: Configuration Validation (tsconfig, package.json)",
                        value: 1,
                        checked: true,
                    },
                    {
                        name: "Layer 2: Pattern & Entity Fixes (HTML entities, old patterns)",
                        value: 2,
                        checked: true,
                    },
                    {
                        name: "Layer 3: Component Best Practices (keys, accessibility)",
                        value: 3,
                        checked: true,
                    },
                    {
                        name: "Layer 4: Hydration & SSR Guard (SSR protection)",
                        value: 4,
                        checked: true,
                    },
                    {
                        name: "Layer 5: Next.js Optimization (App Router patterns)",
                        value: 5,
                        checked: framework === "nextjs",
                    },
                    {
                        name: "Layer 6: Quality & Performance (error handling)",
                        value: 6,
                        checked: false,
                    },
                ],
            },
            {
                type: "input",
                name: "apiUrl",
                message: "NeuroLint API URL:",
                default: process.env.NEUROLINT_API_URL || "http://localhost:3000/api",
                validate: (input) => {
                    try {
                        new URL(input);
                        return true;
                    }
                    catch {
                        return "Please enter a valid URL";
                    }
                },
            },
            {
                type: "list",
                name: "outputFormat",
                message: "Default output format:",
                choices: ["table", "json", "summary"],
                default: "table",
            },
            {
                type: "confirm",
                name: "verbose",
                message: "Enable verbose output by default?",
                default: false,
            },
        ]);
        // Create configuration
        const config = {
            ...defaultConfig,
            layers: {
                ...defaultConfig.layers,
                enabled: answers.layers,
            },
            api: {
                ...defaultConfig.api,
                url: answers.apiUrl,
            },
            output: {
                format: answers.outputFormat,
                verbose: answers.verbose,
            },
        };
        // Customize file patterns based on project type
        if (projectType === "typescript") {
            config.files.include = ["**/*.{ts,tsx}"];
        }
        if (framework === "nextjs") {
            config.files.exclude.push("pages/**", "app/**/_*");
        }
        // Write configuration file
        await fs_extra_1.default.writeJson(configPath, config, { spaces: 2 });
        console.log(chalk_1.default.green("\nNeuroLint configuration created successfully!"));
        console.log(chalk_1.default.blue(`Configuration saved to: ${chalk_1.default.white(".neurolint.json")}`));
        // Create .neurolintignore file
        const ignorePath = path_1.default.join(process.cwd(), ".neurolintignore");
        const ignoreContent = `# NeuroLint ignore patterns
node_modules/
dist/
build/
.next/
coverage/
*.min.js
*.bundle.js
*.d.ts
`;
        await fs_extra_1.default.writeFile(ignorePath, ignoreContent);
        console.log(chalk_1.default.blue(`📁 Ignore file created: ${chalk_1.default.white(".neurolintignore")}`));
        // Show next steps
        console.log(chalk_1.default.blue("\nNext steps:"));
        console.log(chalk_1.default.gray("1. Run analysis: ") + chalk_1.default.white("neurolint analyze"));
        console.log(chalk_1.default.gray("2. Fix issues: ") + chalk_1.default.white("neurolint fix"));
        console.log(chalk_1.default.gray("3. Interactive mode: ") +
            chalk_1.default.white("neurolint interactive"));
        console.log(chalk_1.default.gray("4. View help: ") + chalk_1.default.white("neurolint help"));
        // Offer to run initial analysis
        const { runAnalysis } = await inquirer_1.default.prompt([
            {
                type: "confirm",
                name: "runAnalysis",
                message: "Would you like to run an initial analysis now?",
                default: true,
            },
        ]);
        if (runAnalysis) {
            console.log(chalk_1.default.blue("\n🔍 Running initial analysis...\n"));
            const { analyzeCommand } = await Promise.resolve().then(() => __importStar(require("./analyze")));
            await analyzeCommand([], { layers: answers.layers.join(",") });
        }
    }
    catch (error) {
        spinner.fail(`Initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
