import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import axios from "axios";
import { saveConfig, loadConfig } from "../utils/config";
import { withRetry } from "../utils/retry";

interface LoginOptions {
  apiKey?: string;
  url?: string;
}

export async function loginCommand(options: LoginOptions) {
  console.log(chalk.white.bold("NeuroLint Authentication\n"));

  try {
    const config = await loadConfig();
    let apiUrl = options.url || config.api?.url || "https://neurolint.dev/api";
    let apiKey = options.apiKey;

    if (!apiKey) {
      // Interactive login
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "apiUrl",
          message: "API Server URL:",
          default: apiUrl,
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
          type: "password",
          name: "apiKey",
          message: "API Key:",
          mask: "*",
          validate: (input) => {
            if (!input || input.length < 10) {
              return "API key must be at least 10 characters long";
            }
            return true;
          },
        },
      ]);

      apiUrl = answers.apiUrl;
      apiKey = answers.apiKey;
    }

    const spinner = ora("Verifying authentication...").start();

    try {
      // Test the authentication
      await withRetry(
        async () => {
          const response = await axios.get(`${apiUrl}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          });

          if (response.status !== 200) {
            throw new Error(`Authentication failed: ${response.statusText}`);
          }

          return response.data;
        },
        {
          maxAttempts: 2,
          delay: 1000,
        },
      );

      // Save configuration
      await saveConfig({
        api: { ...config.api, url: apiUrl },
        apiKey,
      });

      spinner.succeed("Authentication successful!");

      console.log(chalk.white("\nLogin Complete"));
      console.log(chalk.white(`API URL: ${apiUrl}`));
      console.log(
        chalk.white(
          `API Key: ${"*".repeat((apiKey?.length || 4) - 4)}${apiKey?.slice(-4) || ""}`,
        ),
      );

      // Show user info if available
      try {
        const userResponse = await axios.get(`${apiUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 5000,
        });

        if (userResponse.data) {
          console.log(
            chalk.white(
              `User: ${userResponse.data.email || userResponse.data.username || "Unknown"}`,
            ),
          );

          if (userResponse.data.plan) {
            console.log(chalk.white(`Plan: ${userResponse.data.plan}`));
          }

          if (userResponse.data.usage) {
            console.log(
              chalk.white(
                `Usage: ${userResponse.data.usage.current}/${userResponse.data.usage.limit} requests`,
              ),
            );
          }
        }
      } catch (error) {
        // Ignore user info errors
      }

      console.log(chalk.gray("\nYou can now run analysis and fix commands"));
    } catch (error) {
      spinner.fail("Authentication failed");

      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          console.log(chalk.white("\nCould not connect to NeuroLint API"));
          console.log(
            chalk.white("Make sure the NeuroLint server is running:"),
          );
          console.log(
            chalk.gray("   npm run dev (in the main project directory)"),
          );
        } else if (
          error.message.includes("401") ||
          error.message.includes("403")
        ) {
          console.log(chalk.white("\nInvalid API key"));
          console.log(
            chalk.white(
              "Check your API key or get a new one from the NeuroLint dashboard",
            ),
          );
        } else if (error.message.includes("404")) {
          console.log(chalk.white("\nAPI endpoint not found"));
          console.log(
            chalk.white(
              "Check the API URL or update NeuroLint to the latest version",
            ),
          );
        } else {
          console.log(chalk.white(`\nAuthentication error: ${error.message}`));
        }
      } else {
        console.log(chalk.white("\nUnknown authentication error"));
      }

      process.exit(1);
    }
  } catch (error) {
    console.error(
      chalk.red(
        `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      ),
    );
    process.exit(1);
  }
}

export async function logoutCommand() {
  console.log(chalk.white.bold("NeuroLint Logout\n"));

  try {
    const config = await loadConfig();

    if (!config.apiKey) {
      console.log(chalk.white("No active session found"));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to logout?",
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.white("Logout cancelled"));
      return;
    }

    // Remove API key from config
    const { apiKey, ...configWithoutKey } = config;
    await saveConfig(configWithoutKey);

    console.log(chalk.white("Logged out successfully"));
    console.log(chalk.gray('Run "neurolint login" to authenticate again'));
  } catch (error) {
    console.error(
      chalk.red(
        `Logout failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      ),
    );
    process.exit(1);
  }
}

export async function statusAuth() {
  try {
    const config = await loadConfig();

    if (!config.apiKey) {
      console.log(chalk.white("Not authenticated"));
      console.log(chalk.gray('Run "neurolint login" to authenticate'));
      return false;
    }

    // Test authentication
    const spinner = ora("Checking authentication...").start();

    try {
      const response = await axios.get(
        `${config.api?.url || "https://api.neurolint.dev"}/api/auth/verify`,
        {
          headers: { Authorization: `Bearer ${config.apiKey}` },
          timeout: 5000,
        },
      );

      spinner.succeed("Authentication valid");
      console.log(chalk.white("Authenticated"));

      return true;
    } catch (error) {
      spinner.fail("Authentication invalid");
      console.log(chalk.white("Authentication expired or invalid"));
      console.log(chalk.gray('Run "neurolint login" to re-authenticate'));

      return false;
    }
  } catch (error) {
    console.error(
      chalk.red(
        `Authentication check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      ),
    );
    return false;
  }
}
