import chalk from "chalk";
import {
  loadConfig,
  saveConfig,
  validateConfig,
  NeuroLintConfig,
} from "../utils/config";
import { validateApiUrl } from "../utils/validation";

function getConfigValue(config: NeuroLintConfig, key: string): any {
  if (key.includes(".")) {
    const keys = key.split(".");
    let current: any = config;
    for (const k of keys) {
      current = current?.[k];
      if (current === undefined) return undefined;
    }
    return current;
  } else {
    return (config as any)[key];
  }
}

function setConfigValue(config: any, key: string, value: string): void {
  if (key.includes(".")) {
    const keys = key.split(".");
    let current = config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  } else {
    config[key] = value;
  }
}

interface ConfigOptions {
  set?: string;
  get?: string;
  list?: boolean;
  reset?: boolean;
}

export async function configCommand(options: ConfigOptions) {
  try {
    const config = await loadConfig();

    if (options.list) {
      console.log(chalk.white.bold("\nNeuroLint Configuration:\n"));
      console.log(
        chalk.white("API URL:"),
        chalk.gray(config.api?.url || "Not set"),
      );
      console.log(
        chalk.white("API Key:"),
        chalk.gray(config.apiKey ? "***" + config.apiKey.slice(-4) : "Not set"),
      );
      console.log(
        chalk.white("Enabled Layers:"),
        chalk.gray(config.layers?.enabled?.join(",") || "1,2,3,4"),
      );
      console.log(
        chalk.white("Output Format:"),
        chalk.gray(config.output?.format || "table"),
      );
      return;
    }

    if (options.get) {
      const value = getConfigValue(config, options.get);
      if (value !== undefined) {
        console.log(chalk.white(value));
      } else {
        console.log(
          chalk.white(`Configuration key "${options.get}" not found`),
        );
      }
      return;
    }

    if (options.set) {
      const [key, value] = options.set.split("=");
      if (!key || !value) {
        console.log(chalk.white("Invalid format. Use: --set key=value"));
        return;
      }

      // Validate specific configuration values
      if (key === "apiUrl" || key === "api.url") {
        const urlValidation = validateApiUrl(value);
        if (!urlValidation.valid) {
          console.log(chalk.white(`ERROR: ${urlValidation.errors[0]}`));
          return;
        }
      }

      // Build nested configuration object if needed
      let newConfig = { ...config };
      setConfigValue(newConfig, key, value);

      // Validate the entire configuration
      const configValidation = await validateConfig(newConfig);
      if (!configValidation.valid) {
        console.log(chalk.white("Configuration validation failed:"));
        configValidation.errors.forEach((error) =>
          console.log(chalk.white(`  ${error}`)),
        );
        return;
      }

      await saveConfig(newConfig);
      console.log(chalk.white(`Set ${key} = ${value}`));

      if (configValidation.errors.length > 0) {
        console.log(chalk.white("Configuration warnings:"));
        configValidation.errors.forEach((warning) =>
          console.log(chalk.white(`  ${warning}`)),
        );
      }

      return;
    }

    if (options.reset) {
      await saveConfig({
        api: { url: "https://api.neurolint.dev", timeout: 60000 },
        apiKey: "",
        layers: { enabled: [1, 2, 3, 4], config: {} },
        output: { format: "table", verbose: false },
      });
      console.log(chalk.white("Configuration reset to defaults"));
      return;
    }

    // Default: show help
    console.log(chalk.white.bold("\nConfiguration Management:\n"));
    console.log(
      chalk.white("neurolint config --list"),
      chalk.gray("# Show all configuration"),
    );
    console.log(
      chalk.white("neurolint config --get apiUrl"),
      chalk.gray("# Get specific value"),
    );
    console.log(
      chalk.white("neurolint config --set apiUrl=https://api.neurolint.dev"),
      chalk.gray("# Set value"),
    );
    console.log(
      chalk.white("neurolint config --reset"),
      chalk.gray("# Reset to defaults"),
    );
  } catch (error) {
    console.error(
      chalk.white("Configuration error:"),
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}
