import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";

interface InitOptions {
  force?: boolean;
}

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

export async function initCommand(options: InitOptions) {
  const configPath = path.join(process.cwd(), ".neurolint.json");
  const spinner = ora("Initializing NeuroLint configuration...").start();

  try {
    // Check if config already exists
    if ((await fs.pathExists(configPath)) && !options.force) {
      spinner.stop();
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: "NeuroLint configuration already exists. Overwrite?",
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow("Configuration initialization cancelled."));
        return;
      }
    }

    spinner.text = "Detecting project structure...";

    // Detect project type
    const packageJsonPath = path.join(process.cwd(), "package.json");
    let projectType = "javascript";
    let framework = "none";

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      if (deps.typescript || deps["@types/node"]) {
        projectType = "typescript";
      }

      if (deps.next) {
        framework = "nextjs";
      } else if (deps.react) {
        framework = "react";
      } else if (deps.vue) {
        framework = "vue";
      }
    }

    spinner.succeed(
      `Detected ${projectType} project with ${framework} framework`,
    );

    // Interactive configuration
    console.log(chalk.blue("\nLet's configure NeuroLint for your project:\n"));

    const answers = await inquirer.prompt([
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
        default: "http://localhost:3000/api",
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
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
    await fs.writeJson(configPath, config, { spaces: 2 });

    console.log(chalk.green("\nNeuroLint configuration created successfully!"));
    console.log(
      chalk.blue(`Configuration saved to: ${chalk.white(".neurolint.json")}`),
    );

    // Create .neurolintignore file
    const ignorePath = path.join(process.cwd(), ".neurolintignore");
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

    await fs.writeFile(ignorePath, ignoreContent);
    console.log(
      chalk.blue(`📁 Ignore file created: ${chalk.white(".neurolintignore")}`),
    );

    // Show next steps
    console.log(chalk.blue("\nNext steps:"));
    console.log(
      chalk.gray("1. Run analysis: ") + chalk.white("neurolint analyze"),
    );
    console.log(chalk.gray("2. Fix issues: ") + chalk.white("neurolint fix"));
    console.log(
      chalk.gray("3. Interactive mode: ") +
        chalk.white("neurolint interactive"),
    );
    console.log(chalk.gray("4. View help: ") + chalk.white("neurolint help"));

    // Offer to run initial analysis
    const { runAnalysis } = await inquirer.prompt([
      {
        type: "confirm",
        name: "runAnalysis",
        message: "Would you like to run an initial analysis now?",
        default: true,
      },
    ]);

    if (runAnalysis) {
      console.log(chalk.blue("\n🔍 Running initial analysis...\n"));
      const { analyzeCommand } = await import("./analyze");
      await analyzeCommand([], { layers: answers.layers.join(",") });
    }
  } catch (error) {
    spinner.fail(
      `Initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
