#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { analyzeCommand } from "./commands/analyze-fixed";
import { fixCommand } from "./commands/fix-fixed";
import { configCommand } from "./commands/config";
import { initCommand } from "./commands/init";
import { statusCommand } from "./commands/status";
import { loginCommand, logoutCommand } from "./commands/login";

const program = new Command();

program
  .name("neurolint")
  .description("NeuroLint CLI - Advanced code analysis and transformation")
  .version("1.0.0");

// Welcome message
console.log(chalk.white.bold("NeuroLint CLI"));
console.log(chalk.gray("Advanced code analysis and transformation\n"));

// Initialize project command
program
  .command("init")
  .description("Initialize NeuroLint in your project")
  .option("-f, --force", "Overwrite existing configuration")
  .action(initCommand);

// Authentication commands
program
  .command("login")
  .description("Authenticate with NeuroLint service")
  .option("--api-key <key>", "API key for authentication")
  .option("--url <url>", "API server URL")
  .action(loginCommand);

program
  .command("logout")
  .description("Clear authentication credentials")
  .action(logoutCommand);

// Analysis command
program
  .command("analyze [files...]")
  .alias("scan")
  .description("Analyze code files for issues and improvements")
  .option("-l, --layers <layers>", "Specify layers to run (1-6)", "1,2,3,4")
  .option(
    "-o, --output <format>",
    "Output format (json|table|summary)",
    "table",
  )
  .option("-r, --recursive", "Analyze files recursively")
  .option("--include <patterns>", "Include file patterns (comma-separated)")
  .option("--exclude <patterns>", "Exclude file patterns (comma-separated)")
  .option("--config <path>", "Configuration file path")
  .action(analyzeCommand);

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
  .action(fixCommand);

// Status command
program
  .command("status")
  .description("Show project analysis status and statistics")
  .option("--detailed", "Show detailed statistics")
  .action(statusCommand);

// Configuration management
program
  .command("config")
  .description("Manage NeuroLint configuration")
  .option("--set <key=value>", "Set configuration value")
  .option("--get <key>", "Get configuration value")
  .option("--list", "List all configuration")
  .option("--reset", "Reset to default configuration")
  .action(configCommand);

// Interactive mode
program
  .command("interactive")
  .alias("i")
  .description("Run NeuroLint in interactive mode")
  .action(async () => {
    console.log(chalk.white("NeuroLint Interactive Mode\n"));

    const answers = await inquirer.prompt([
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
        console.log(chalk.white("Starting code analysis..."));
        await analyzeCommand([], {});
        break;
      case "Fix code issues":
        console.log(chalk.white("Starting code fixes..."));
        await fixCommand([], {});
        break;
      case "View project status":
        await statusCommand({});
        break;
      case "Configure settings":
        await configCommand({});
        break;
      default:
        console.log(chalk.white("Goodbye"));
        process.exit(0);
    }
  });

// Help command
program
  .command("help")
  .description("Show help and examples")
  .action(() => {
    console.log(chalk.white.bold("\nNeuroLint CLI Examples\n"));

    console.log(chalk.white("Getting Started:"));
    console.log(
      chalk.gray(
        "  neurolint init                    # Initialize in your project",
      ),
    );
    console.log(
      chalk.gray("  neurolint login                   # Authenticate with API"),
    );
    console.log(
      chalk.gray("  neurolint status                  # Check project status"),
    );
    console.log();

    console.log(chalk.white("Code Analysis:"));
    console.log(
      chalk.gray("  neurolint analyze src/            # Analyze src directory"),
    );
    console.log(
      chalk.gray("  neurolint analyze --layers=1,2,3 # Run specific layers"),
    );
    console.log(
      chalk.gray("  neurolint analyze --output=json  # JSON output format"),
    );
    console.log();

    console.log(chalk.white("Code Fixes:"));
    console.log(
      chalk.gray("  neurolint fix src/                # Fix all issues"),
    );
    console.log(
      chalk.gray("  neurolint fix --dry-run          # Preview fixes"),
    );
    console.log(
      chalk.gray("  neurolint fix --backup           # Create backups"),
    );
    console.log();

    console.log(chalk.white("Layer System:"));
    console.log(
      chalk.gray(
        "  Layer 1: Configuration validation (tsconfig, package.json)",
      ),
    );
    console.log(
      chalk.gray("  Layer 2: Pattern & entity fixes (HTML entities, patterns)"),
    );
    console.log(
      chalk.gray(
        "  Layer 3: Component best practices (React keys, accessibility)",
      ),
    );
    console.log(chalk.gray("  Layer 4: Hydration & SSR protection"));
    console.log(
      chalk.gray("  Layer 5: Next.js optimizations (App Router patterns)"),
    );
    console.log(
      chalk.gray("  Layer 6: Quality & performance (error handling)"),
    );
    console.log();

    console.log(
      chalk.cyan("For more information, visit: http://localhost:3000/api-docs"),
    );
  });

// Default help if no command
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
