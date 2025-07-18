#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { loadConfig, saveConfig } from "./utils/config";
import type { NeuroLintConfig } from "./types";

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
  .action(async (options) => {
    const spinner = ora("Initializing NeuroLint configuration...").start();

    try {
      const configPath = path.join(process.cwd(), ".neurolint.json");

      if ((await fs.pathExists(configPath)) && !options.force) {
        spinner.stop();
        console.log(
          chalk.yellow(
            "⚠️  Configuration already exists. Use --force to overwrite.",
          ),
        );
        return;
      }

      const defaultConfig: Partial<NeuroLintConfig> = {
        version: "1.0.0",
        layers: {
          enabled: [1, 2, 3, 4],
          config: {
            1: { name: "Configuration Validation", timeout: 30000 },
            2: { name: "Pattern & Entity Fixes", timeout: 45000 },
            3: { name: "Component Best Practices", timeout: 60000 },
            4: { name: "Hydration & SSR Guard", timeout: 45000 },
          },
        },
        files: {
          include: ["**/*.{ts,tsx,js,jsx}"],
          exclude: ["node_modules/**", "dist/**", "build/**"],
        },
        output: {
          format: "table",
          verbose: false,
        },
        api: {
          url: "https://api.neurolint.dev",
          timeout: 60000,
        },
      };

      await saveConfig(defaultConfig);
      spinner.stop();

      console.log(chalk.green("NeuroLint initialized successfully!"));
      console.log(chalk.gray(`Configuration saved to: ${configPath}`));
      console.log(chalk.gray("\nNext steps:"));
      console.log(
        chalk.gray("  1. Run 'neurolint analyze src/' to analyze your code"),
      );
      console.log(
        chalk.gray("  2. Run 'neurolint login' to connect to NeuroLint cloud"),
      );
    } catch (error) {
      spinner.stop();
      console.log(chalk.red("❌ Failed to initialize NeuroLint"));
      console.log(
        chalk.gray(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });

// Status command
program
  .command("status")
  .description("Show project analysis status and statistics")
  .option("--detailed", "Show detailed statistics")
  .action(async (options) => {
    console.log(chalk.white.bold("NeuroLint Project Status\n"));

    try {
      const config = await loadConfig();

      console.log(chalk.white("Configuration:"));
      console.log(chalk.green("Configuration found"));
      console.log(chalk.gray(`  API URL: ${config.api.url}`));
      console.log(
        chalk.gray(`  Enabled Layers: ${config.layers.enabled.join(", ")}`),
      );
      console.log(chalk.gray(`  Output Format: ${config.output.format}`));
      console.log();

      console.log(chalk.white("Project Structure:"));

      // Check for package.json
      if (await fs.pathExists(path.join(process.cwd(), "package.json"))) {
        console.log(chalk.green("package.json found"));
      } else {
        console.log(chalk.yellow("package.json not found"));
      }

      // Check for TypeScript
      if (await fs.pathExists(path.join(process.cwd(), "tsconfig.json"))) {
        console.log(chalk.green("TypeScript project detected"));
      } else {
        console.log(chalk.gray("No TypeScript configuration found"));
      }

      // Check for common frameworks
      const packageJsonPath = path.join(process.cwd(), "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        const dependencies = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        if (dependencies.react) {
          console.log(chalk.green("React project detected"));
        }
        if (dependencies.next) {
          console.log(chalk.green("Next.js project detected"));
        }
        if (dependencies.vue) {
          console.log(chalk.green("Vue.js project detected"));
        }
      }

      console.log();
      console.log(chalk.white("Ready to analyze! Run:"));
      console.log(chalk.gray("  neurolint analyze src/"));
    } catch (error) {
      console.log(chalk.red("❌ Configuration error"));
      console.log(
        chalk.gray(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
      console.log(
        chalk.gray("\nRun 'neurolint init' to create a configuration file."),
      );
    }
  });

// Analyze command
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
  .option("--dry-run", "Preview analysis without executing")
  .action(async (files, options) => {
    const spinner = ora("Initializing NeuroLint analysis...").start();

    try {
      const config = await loadConfig();

      if (!config.apiKey) {
        spinner.stop();
        console.log(chalk.yellow("⚠️  Authentication required"));
        console.log(chalk.gray("Run 'neurolint login' to authenticate first"));
        return;
      }

      const layers = options.layers
        .split(",")
        .map((l: string) => parseInt(l.trim()));
      const targetFiles = files.length > 0 ? files : ["src/"];

      spinner.text = "Connecting to NeuroLint API...";

      spinner.stop();
      console.log(
        chalk.red(
          "Analysis feature not implemented - connect to real NeuroLint API",
        ),
      );
      process.exit(1);
    } catch (error) {
      spinner.stop();
      console.log(chalk.red("❌ Analysis failed"));
      console.log(
        chalk.gray(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });

// Fix command
program
  .command("fix [files...]")
  .description("Fix code issues automatically")
  .option("-l, --layers <layers>", "Specify layers to run (1-6)", "1,2,3,4")
  .option("--dry-run", "Preview changes without applying them")
  .option("--backup", "Create backup files before fixing")
  .action(async (files, options) => {
    const spinner = ora("Preparing to fix code issues...").start();

    try {
      const config = await loadConfig();

      if (!config.apiKey) {
        spinner.stop();
        console.log(chalk.yellow("⚠️  Authentication required"));
        console.log(chalk.gray("Run 'neurolint login' to authenticate first"));
        return;
      }

      const layers = options.layers
        .split(",")
        .map((l: string) => parseInt(l.trim()));

      if (options.dryRun) {
        spinner.text = "Previewing potential fixes...";
      } else {
        spinner.text = "Applying fixes...";
      }

      spinner.stop();
      console.log(
        chalk.red(
          "Fix feature not implemented - connect to real NeuroLint API",
        ),
      );
      process.exit(1);
    } catch (error) {
      spinner.stop();
      console.log(chalk.red("❌ Fix process failed"));
      console.log(
        chalk.gray(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });

// Login command
program
  .command("login")
  .description("Authenticate with NeuroLint service")
  .option("--api-key <key>", "API key for authentication")
  .option("--url <url>", "API server URL")
  .action(async (options) => {
    const spinner = ora("Authenticating with NeuroLint...").start();

    try {
      spinner.stop();
      console.log(
        chalk.red(
          "Login feature not implemented - connect to real NeuroLint API",
        ),
      );
      process.exit(1);
    } catch (error) {
      spinner.stop();
      console.log(chalk.red("❌ Authentication failed"));
      console.log(
        chalk.gray(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });

// Help command with examples
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

    console.log(chalk.white("Configuration:"));
    console.log(
      chalk.gray("  neurolint init --force            # Recreate config"),
    );
    console.log(chalk.gray("  neurolint login --api-key KEY    # Set API key"));
    console.log();

    console.log(
      chalk.cyan("📚 For more information, visit: https://neurolint.dev/docs"),
    );
  });

// Default help if no command
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
