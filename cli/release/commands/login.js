"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCommand = loginCommand;
exports.logoutCommand = logoutCommand;
exports.statusAuth = statusAuth;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const retry_1 = require("../utils/retry");
async function loginCommand(options) {
    console.log(chalk_1.default.white.bold("NeuroLint Authentication\n"));
    try {
        const config = await (0, config_1.loadConfig)();
        let apiUrl = options.url || config.api?.url || "https://neurolint.dev/api";
        let apiKey = options.apiKey;
        if (!apiKey) {
            // Interactive login
            const answers = await inquirer_1.default.prompt([
                {
                    type: "input",
                    name: "apiUrl",
                    message: "API Server URL:",
                    default: apiUrl,
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
        const spinner = (0, ora_1.default)("Verifying authentication...").start();
        try {
            // Test the authentication
            await (0, retry_1.withRetry)(async () => {
                const response = await axios_1.default.get(`${apiUrl}/api/auth/verify`, {
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
            }, {
                maxAttempts: 2,
                delay: 1000,
            });
            // Save configuration
            await (0, config_1.saveConfig)({
                api: { ...config.api, url: apiUrl },
                apiKey,
            });
            spinner.succeed("Authentication successful!");
            console.log(chalk_1.default.white("\nLogin Complete"));
            console.log(chalk_1.default.white(`API URL: ${apiUrl}`));
            console.log(chalk_1.default.white(`API Key: ${"*".repeat((apiKey?.length || 4) - 4)}${apiKey?.slice(-4) || ""}`));
            // Show user info if available
            try {
                const userResponse = await axios_1.default.get(`${apiUrl}/api/user/profile`, {
                    headers: { Authorization: `Bearer ${apiKey}` },
                    timeout: 5000,
                });
                if (userResponse.data) {
                    console.log(chalk_1.default.white(`User: ${userResponse.data.email || userResponse.data.username || "Unknown"}`));
                    if (userResponse.data.plan) {
                        console.log(chalk_1.default.white(`Plan: ${userResponse.data.plan}`));
                    }
                    if (userResponse.data.usage) {
                        console.log(chalk_1.default.white(`Usage: ${userResponse.data.usage.current}/${userResponse.data.usage.limit} requests`));
                    }
                }
            }
            catch (error) {
                // Ignore user info errors
            }
            console.log(chalk_1.default.gray("\nYou can now run analysis and fix commands"));
        }
        catch (error) {
            spinner.fail("Authentication failed");
            if (error instanceof Error) {
                if (error.message.includes("ECONNREFUSED")) {
                    console.log(chalk_1.default.white("\nCould not connect to NeuroLint API"));
                    console.log(chalk_1.default.white("Make sure the NeuroLint server is running:"));
                    console.log(chalk_1.default.gray("   npm run dev (in the main project directory)"));
                }
                else if (error.message.includes("401") ||
                    error.message.includes("403")) {
                    console.log(chalk_1.default.white("\nInvalid API key"));
                    console.log(chalk_1.default.white("Check your API key or get a new one from the NeuroLint dashboard"));
                }
                else if (error.message.includes("404")) {
                    console.log(chalk_1.default.white("\nAPI endpoint not found"));
                    console.log(chalk_1.default.white("Check the API URL or update NeuroLint to the latest version"));
                }
                else {
                    console.log(chalk_1.default.white(`\nAuthentication error: ${error.message}`));
                }
            }
            else {
                console.log(chalk_1.default.white("\nUnknown authentication error"));
            }
            process.exit(1);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Login failed: ${error instanceof Error ? error.message : "Unknown error"}`));
        process.exit(1);
    }
}
async function logoutCommand() {
    console.log(chalk_1.default.white.bold("NeuroLint Logout\n"));
    try {
        const config = await (0, config_1.loadConfig)();
        if (!config.apiKey) {
            console.log(chalk_1.default.white("No active session found"));
            return;
        }
        const { confirm } = await inquirer_1.default.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: "Are you sure you want to logout?",
                default: false,
            },
        ]);
        if (!confirm) {
            console.log(chalk_1.default.white("Logout cancelled"));
            return;
        }
        // Remove API key from config
        const { apiKey, ...configWithoutKey } = config;
        await (0, config_1.saveConfig)(configWithoutKey);
        console.log(chalk_1.default.white("Logged out successfully"));
        console.log(chalk_1.default.gray('Run "neurolint login" to authenticate again'));
    }
    catch (error) {
        console.error(chalk_1.default.red(`Logout failed: ${error instanceof Error ? error.message : "Unknown error"}`));
        process.exit(1);
    }
}
async function statusAuth() {
    try {
        const config = await (0, config_1.loadConfig)();
        if (!config.apiKey) {
            console.log(chalk_1.default.white("Not authenticated"));
            console.log(chalk_1.default.gray('Run "neurolint login" to authenticate'));
            return false;
        }
        // Test authentication
        const spinner = (0, ora_1.default)("Checking authentication...").start();
        try {
            const response = await axios_1.default.get(`${config.api?.url || "https://api.neurolint.dev"}/api/auth/verify`, {
                headers: { Authorization: `Bearer ${config.apiKey}` },
                timeout: 5000,
            });
            spinner.succeed("Authentication valid");
            console.log(chalk_1.default.white("Authenticated"));
            return true;
        }
        catch (error) {
            spinner.fail("Authentication invalid");
            console.log(chalk_1.default.white("Authentication expired or invalid"));
            console.log(chalk_1.default.gray('Run "neurolint login" to re-authenticate'));
            return false;
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Authentication check failed: ${error instanceof Error ? error.message : "Unknown error"}`));
        return false;
    }
}
