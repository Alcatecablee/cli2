#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const analyze_fixed_1 = require("./commands/analyze-fixed");
const fix_fixed_1 = require("./commands/fix-fixed");
const config_1 = require("./commands/config");
const init_1 = require("./commands/init");
const status_1 = require("./commands/status");
const login_1 = require("./commands/login");
const program = new commander_1.Command();
program
    .name("neurolint")
    .description("NeuroLint CLI - Advanced code analysis and transformation")
    .version("1.0.6");
// Welcome message
console.log(chalk_1.default.white.bold("NeuroLint CLI"));
console.log(chalk_1.default.gray("Advanced code analysis and transformation\n"));
// Initialize project command
program
    .command("init")
    .description("Initialize NeuroLint in your project")
    .option("-f, --force", "Overwrite existing configuration")
    .action(init_1.initCommand);
// Authentication commands
program
    .command("login")
    .description("Authenticate with NeuroLint service")
    .option("--api-key <key>", "API key for authentication")
    .option("--url <url>", "API server URL")
    .action(login_1.loginCommand);
program
    .command("logout")
    .description("Clear authentication credentials")
    .action(login_1.logoutCommand);
// Analysis command
program
    .command("analyze [files...]")
    .alias("scan")
    .description("Analyze code files for issues and improvements")
    .option("-l, --layers <layers>", "Specify layers to run (1-6)", "1,2,3,4")
    .option("-o, --output <format>", "Output format (json|table|summary)", "table")
    .option("-r, --recursive", "Analyze files recursively")
    .option("--include <patterns>", "Include file patterns (comma-separated)")
    .option("--exclude <patterns>", "Exclude file patterns (comma-separated)")
    .option("--config <path>", "Configuration file path")
    .action(analyze_fixed_1.analyzeCommand);
// Fix command
program
    .command("fix [files...]")
    .description("Fix code issues automatically")
    .option("-l, --layers <layers>", "Specify layers to run (1-6)", "1,2,3,4")
    .option("-r, --recursive", "Fix files recursively")
    .option("--dry-run", "Preview changes without applying them")
    .option("--backup", "Create backup files before fixing")
    .option("--include <patterns>", "Include file patterns (comma-separated)")
    .option("--exclude <patterns>", "Exclude file patterns (comma-separated)")
    .option("--config <path>", "Configuration file path")
    .action(fix_fixed_1.fixCommand);
// Status command
program
    .command("status")
    .description("Show project analysis status and statistics")
    .option("--detailed", "Show detailed statistics")
    .action(status_1.statusCommand);
// Configuration management
program
    .command("config")
    .description("Manage NeuroLint configuration")
    .option("--set <key=value>", "Set configuration value")
    .option("--get <key>", "Get configuration value")
    .option("--list", "List all configuration")
    .option("--reset", "Reset to default configuration")
    .action(config_1.configCommand);
// Interactive mode
program
    .command("interactive")
    .alias("i")
    .description("Run NeuroLint in interactive mode")
    .action(async () => {
    console.log(chalk_1.default.white("NeuroLint Interactive Mode\n"));
    const answers = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "Analyze code files",
                "Fix code issues",
                "View project status",
                "Configure settings",
                "Exit",
            ],
        },
    ]);
    switch (answers.action) {
        case "Analyze code files":
            console.log(chalk_1.default.white("Starting code analysis..."));
            await (0, analyze_fixed_1.analyzeCommand)([], {});
            break;
        case "Fix code issues":
            console.log(chalk_1.default.white("Starting code fixes..."));
            await (0, fix_fixed_1.fixCommand)([], {});
            break;
        case "View project status":
            await (0, status_1.statusCommand)({});
            break;
        case "Configure settings":
            await (0, config_1.configCommand)({});
            break;
        default:
            console.log(chalk_1.default.white("Goodbye"));
            process.exit(0);
    }
});
// Help command
program
    .command("help")
    .description("Show help and examples")
    .action(() => {
    console.log(chalk_1.default.white.bold("\nNeuroLint CLI Examples\n"));
    console.log(chalk_1.default.white("Getting Started:"));
    console.log(chalk_1.default.gray("  neurolint init                    # Initialize in your project"));
    console.log(chalk_1.default.gray("  neurolint login                   # Authenticate with API"));
    console.log(chalk_1.default.gray("  neurolint status                  # Check project status"));
    console.log();
    console.log(chalk_1.default.white("Code Analysis:"));
    console.log(chalk_1.default.gray("  neurolint analyze src/            # Analyze src directory"));
    console.log(chalk_1.default.gray("  neurolint analyze --layers=1,2,3 # Run specific layers"));
    console.log(chalk_1.default.gray("  neurolint analyze --output=json  # JSON output format"));
    console.log();
    console.log(chalk_1.default.white("Code Fixes:"));
    console.log(chalk_1.default.gray("  neurolint fix src/                # Fix all issues"));
    console.log(chalk_1.default.gray("  neurolint fix --dry-run          # Preview fixes"));
    console.log(chalk_1.default.gray("  neurolint fix --backup           # Create backups"));
    console.log();
    console.log(chalk_1.default.white("Layer System (with automatic dependency management):"));
    console.log(chalk_1.default.gray("  Layer 1: Configuration validation (tsconfig, package.json)"));
    console.log(chalk_1.default.gray("  Layer 2: Pattern & entity fixes (HTML entities, patterns) [requires: 1]"));
    console.log(chalk_1.default.gray("  Layer 3: Component best practices (React keys, accessibility) [requires: 1,2]"));
    console.log(chalk_1.default.gray("  Layer 4: Hydration & SSR protection [requires: 1,2,3]"));
    console.log(chalk_1.default.gray("  Layer 5: Next.js optimizations (App Router patterns) [requires: 1,2,3,4]"));
    console.log(chalk_1.default.gray("  Layer 6: Quality & performance (error handling) [requires: 1,2,3,4,5]"));
    console.log();
    console.log(chalk_1.default.cyan("For more information, visit: http://localhost:3000/api-docs"));
});
// Default help if no command
if (process.argv.length <= 2) {
    program.help();
}
program.parse();
