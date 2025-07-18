module.exports = {
  // API Configuration
  apiUrl: "http://localhost:5000",
  apiKey: "",

  // Analysis Settings
  enabledLayers: [1, 2, 3, 4],
  timeout: 30000,

  // File Processing
  include: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],

  // Output Settings
  outputFormat: "table",
  showProgress: true,
  verbose: false,
};
