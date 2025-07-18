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

// Configuration command
program
  .command("config")
  .description("Manage NeuroLint configuration")
  .option("--show", "Show current configuration")
  .option("--set <key=value>", "Set configuration value")
  .option("--unset <key>", "Remove configuration value")
  .option("--reset", "Reset to defaults")
  .action(configCommand);

// Status command
program
  .command("status")
  .description("Show project status and configuration")
  .action(statusCommand);

// Code analysis command
program
  .command("analyze")
  .description("Analyze code for issues and improvements")
  .argument("[path]", "Path to analyze (default: current directory)")
  .option("-l, --layers <layers>", "Specify layers to run (1-6)")
  .option("-f, --files <pattern>", "File pattern to include")
  .option("-e, --exclude <pattern>", "File pattern to exclude")
  .option("-o, --output <format>", "Output format (json|text|summary)")
  .option("-v, --verbose", "Verbose output")
  .option("--recursive", "Analyze directories recursively")
  .option("--max-files <number>", "Maximum number of files to analyze")
  .action(analyzeCommand);

// Code fixing command
program
  .command("fix")
  .description("Fix code issues and apply transformations")
  .argument("[path]", "Path to fix (default: current directory)")
  .option("-l, --layers <layers>", "Specify layers to run (1-6)")
  .option("-f, --files <pattern>", "File pattern to include")
  .option("-e, --exclude <pattern>", "File pattern to exclude")
  .option("--dry-run", "Preview changes without applying")
  .option("--backup", "Create backup before applying fixes")
  .option("--recursive", "Fix directories recursively")
  .option("-v, --verbose", "Verbose output")
  .action(fixCommand);

// Interactive mode
program
  .command("interactive")
  .alias("i")
  .description("Interactive mode for guided operations")
  .action(async () => {
    console.log(chalk.white.bold("NeuroLint Interactive Mode\n"));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Analyze project", value: "analyze" },
          { name: "Fix issues", value: "fix" },
          { name: "Configure settings", value: "config" },
          { name: "Check status", value: "status" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "analyze":
        console.log(chalk.white("Starting code analysis..."));
        break;
      case "fix":
        console.log(chalk.white("Starting code fixes..."));
        break;
      case "config":
        console.log(chalk.white("Opening configuration..."));
        break;
      case "status":
        console.log(chalk.white("Checking project status..."));
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
    console.log(chalk.white.bold("\nNeuroLint CLI Examples:\n"));

    console.log(chalk.white("Initialize project:"));
    console.log(chalk.gray("  neurolint init\n"));

    console.log(chalk.white("Analyze specific files:"));
    console.log(chalk.gray("  neurolint analyze src/components/*.tsx\n"));

    console.log(chalk.white("Fix all TypeScript files:"));
    console.log(
      chalk.gray('  neurolint fix --recursive --include="**/*.ts,**/*.tsx"\n'),
    );

    console.log(chalk.white("Run specific layers:"));
    console.log(chalk.gray("  neurolint analyze --layers=1,3,4 src/\n"));

    console.log(chalk.white("Preview fixes without applying:"));
    console.log(chalk.gray("  neurolint fix --dry-run src/components/\n"));

    console.log(chalk.white("Interactive mode:"));
    console.log(chalk.gray("  neurolint interactive\n"));
  });

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err: any) {
  if (err.code === "commander.unknownOption") {
    console.error(chalk.red(`Unknown option: ${err.message}`));
    console.log(chalk.gray("Use 'neurolint --help' to see available options"));
  } else if (err.code === "commander.unknownCommand") {
    console.error(chalk.red(`Unknown command: ${err.message}`));
    console.log(chalk.gray("Use 'neurolint --help' to see available commands"));
  } else {
    console.error(chalk.red(`Error: ${err.message}`));
  }
  process.exit(1);
}
