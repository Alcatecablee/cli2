import * as vscode from "vscode";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ConfigurationManager } from "./ConfigurationManager";

export interface AnalysisRequest {
  code: string;
  filename?: string;
  layers: number[];
  metadata?: any;
}

export interface AnalysisResult {
  success: boolean;
  transformedCode?: string;
  changes?: Array<{
    line: number;
    column: number;
    message: string;
    severity: "error" | "warning" | "info";
    fix?: string;
  }>;
  errors?: string[];
  metadata?: any;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "team" | "enterprise";
  usage: {
    current: number;
    limit: number;
  };
  features: {
    premiumAnalysis: boolean;
    bulkProcessing: boolean;
    realTimeLinting: boolean;
    advancedRefactoring: boolean;
    teamCollaboration: boolean;
  };
}

export class ApiClient {
  private client: AxiosInstance;
  private secrets: vscode.SecretStorage;

  constructor(
    private configManager: ConfigurationManager,
    secrets: vscode.SecretStorage,
  ) {
    this.secrets = secrets;
    this.client = this.createAxiosInstance();
  }

  public async analyzeCode(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      const response = await this.client.post("/api/analyze", {
        ...request,
        metadata: {
          ...request.metadata,
          source: "vscode-extension",
          version: "1.0.2",
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async analyzeWorkspace(
    files: Array<{
      filename: string;
      code: string;
    }>,
  ): Promise<AnalysisResult> {
    try {
      const response = await this.client.post("/api/analyze/workspace", {
        files,
        layers: this.configManager.getEnabledLayers(),
        metadata: {
          source: "vscode-extension",
          version: "1.0.2",
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async authenticate(apiKey: string): Promise<UserInfo> {
    try {
      const tempClient = axios.create({
        baseURL: this.configManager.getApiUrl(),
        timeout: this.configManager.getTimeout(),
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      const response = await tempClient.get("/api/user/profile");

      // Map plan to features
      const plan = response.data.plan || "free";
      const features = this.mapPlanToFeatures(plan);

      return {
        ...response.data,
        features,
      };
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private mapPlanToFeatures(plan: string) {
    const isPro = plan === "pro";
    const isTeam = plan === "team";
    const isEnterprise = plan === "enterprise";
    const isPremium = isPro || isTeam || isEnterprise;

    return {
      premiumAnalysis: isPremium,
      bulkProcessing: isPremium,
      realTimeLinting: isPremium,
      advancedRefactoring: isPremium,
      teamCollaboration: isTeam || isEnterprise,
    };
  }

  public async getUserInfo(): Promise<UserInfo | null> {
    try {
      const response = await this.client.get("/api/user/profile");
      const plan = response.data.plan || "free";
      const features = this.mapPlanToFeatures(plan);

      return {
        ...response.data,
        features,
      };
    } catch (error) {
      return null;
    }
  }

  public async canUseFeature(
    feature: keyof UserInfo["features"],
  ): Promise<boolean> {
    const userInfo = await this.getUserInfo();
    if (!userInfo) return false;
    return userInfo.features[feature];
  }

  public async checkUsageLimit(): Promise<{
    canUse: boolean;
    usage: { current: number; limit: number };
  }> {
    try {
      const userInfo = await this.getUserInfo();
      if (!userInfo) {
        return { canUse: true, usage: { current: 0, limit: 25 } }; // Default for unauthenticated users
      }

      const canUse =
        userInfo.usage.current < userInfo.usage.limit ||
        userInfo.usage.limit === -1;
      return { canUse, usage: userInfo.usage };
    } catch (error) {
      return { canUse: true, usage: { current: 0, limit: 25 } };
    }
  }

  public isAuthenticated(): boolean {
    return !!this.configManager.getApiKey();
  }

  public async validateApiKey(): Promise<boolean> {
    try {
      await this.getUserInfo();
      return true;
    } catch {
      return false;
    }
  }

  public async getUsageStats(): Promise<any> {
    try {
      const response = await this.client.get("/api/user/usage");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.configManager.getApiUrl(),
      timeout: this.configManager.getTimeout(),
    });

    // Request interceptor
    instance.interceptors.request.use((config) => {
      const apiKey = this.configManager.getApiKey();

      if (apiKey) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${apiKey}`;
      }

      config.baseURL = this.configManager.getApiUrl();
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
      config.headers["User-Agent"] = "NeuroLint-VSCode/1.0.3";

      return config;
    });

    // Response interceptor
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          vscode.window.showErrorMessage(
            "NeuroLint: Authentication failed. Please check your API key.",
          );
        } else if (error.response?.status === 429) {
          vscode.window.showWarningMessage(
            "NeuroLint: Rate limit exceeded. Please try again later.",
          );
        } else if (error.response?.status >= 500) {
          vscode.window.showErrorMessage(
            "NeuroLint: Server error. Please try again later.",
          );
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }

  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      switch (status) {
        case 400:
          return new Error(`Invalid request: ${message}`);
        case 401:
          return new Error("Authentication failed. Please check your API key.");
        case 403:
          return new Error("Access forbidden. Please check your permissions.");
        case 404:
          return new Error("API endpoint not found.");
        case 429:
          return new Error("Rate limit exceeded. Please try again later.");
        case 500:
          return new Error("Server error. Please try again later.");
        default:
          return new Error(`HTTP ${status}: ${message}`);
      }
    } else if (error.request) {
      return new Error("Network error. Please check your internet connection.");
    } else {
      return new Error(error.message || "Unknown error occurred");
    }
  }
}
