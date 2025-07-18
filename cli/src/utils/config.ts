import fs from "fs-extra";
import path from "path";

export interface NeuroLintConfig {
  version: string;
  layers: {
    enabled: number[];
    config: Record<
      number,
      { name: string; timeout: number; enabled?: boolean }
    >;
  };
  files: {
    include: string[];
    exclude: string[];
  };
  output: {
    format: "table" | "json" | "summary";
    verbose: boolean;
  };
  api: {
    url: string;
    timeout: number;
  };
  apiKey?: string;
}

export async function loadConfig(
  configPath?: string,
): Promise<NeuroLintConfig> {
  const defaultConfig: NeuroLintConfig = {
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

  // Try multiple config file locations
  const configPaths = [
    configPath,
    path.join(process.cwd(), ".neurolint.json"),
    path.join(process.cwd(), "neurolint.config.json"),
    path.join(process.cwd(), "package.json"),
  ].filter((p): p is string => Boolean(p));

  for (const filePath of configPaths) {
    if (await fs.pathExists(filePath)) {
      try {
        const fileContent = await fs.readJson(filePath);

        if (filePath.endsWith("package.json")) {
          // Extract neurolint config from package.json
          if (
            fileContent &&
            typeof fileContent === "object" &&
            fileContent.neurolint
          ) {
            return { ...defaultConfig, ...fileContent.neurolint };
          }
        } else {
          return { ...defaultConfig, ...fileContent };
        }
      } catch (error) {
        console.warn(`Failed to load config from ${filePath}:`, error);
      }
    }
  }

  return defaultConfig;
}

export async function saveConfig(
  config: Partial<NeuroLintConfig>,
  configPath?: string,
): Promise<void> {
  const filePath = configPath || path.join(process.cwd(), ".neurolint.json");

  try {
    // Load existing config and merge with new values
    const existingConfig = await loadConfig(configPath);
    const mergedConfig = { ...existingConfig, ...config };

    // Ensure directory exists
    await fs.ensureDir(path.dirname(filePath));

    // Write configuration file
    await fs.writeJson(filePath, mergedConfig, { spaces: 2 });
  } catch (error) {
    throw new Error(
      `Failed to save configuration: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function validateConfig(
  config: NeuroLintConfig,
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Validate API URL
  if (config.api?.url) {
    try {
      new URL(config.api.url);
    } catch {
      errors.push("Invalid API URL format");
    }
  }

  // Validate layers
  if (config.layers?.enabled) {
    const invalidLayers = config.layers.enabled.filter(
      (layer) => !Number.isInteger(layer) || layer < 1 || layer > 6,
    );
    if (invalidLayers.length > 0) {
      errors.push(
        `Invalid layer numbers: ${invalidLayers.join(", ")}. Must be integers between 1-6.`,
      );
    }
  }

  // Validate file patterns
  if (config.files?.include && !Array.isArray(config.files.include)) {
    errors.push("files.include must be an array of glob patterns");
  }

  if (config.files?.exclude && !Array.isArray(config.files.exclude)) {
    errors.push("files.exclude must be an array of glob patterns");
  }

  // Validate output format
  if (
    config.output?.format &&
    !["table", "json", "summary"].includes(config.output.format)
  ) {
    errors.push("output.format must be one of: table, json, summary");
  }

  return { valid: errors.length === 0, errors };
}

export async function getConfigPath(): Promise<string | null> {
  const possiblePaths = [
    path.join(process.cwd(), ".neurolint.json"),
    path.join(process.cwd(), "neurolint.config.json"),
    path.join(process.cwd(), "package.json"),
  ];

  for (const configPath of possiblePaths) {
    if (await fs.pathExists(configPath)) {
      return configPath;
    }
  }

  return null;
}
