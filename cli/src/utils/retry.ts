import chalk from "chalk";

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffFactor?: number;
  maxDelay?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (error: any, attempt: number) => void;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffFactor = 2,
    maxDelay = 10000,
    retryCondition = (error) => isRetryableError(error),
    onRetry,
  } = options;

  let lastError: any;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !retryCondition(error)) {
        throw error;
      }

      if (onRetry) {
        onRetry(error, attempt);
      }

      // Wait before retrying
      await sleep(Math.min(currentDelay, maxDelay));
      currentDelay *= backoffFactor;
    }
  }

  throw lastError;
}

export function isRetryableError(error: any): boolean {
  if (!error) return false;

  // Network errors that are retryable
  const retryableCodes = [
    "ECONNRESET",
    "ENOTFOUND",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "TIMEOUT",
  ];

  if (error.code && retryableCodes.includes(error.code)) {
    return true;
  }

  // HTTP status codes that are retryable
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  if (
    error.response?.status &&
    retryableStatuses.includes(error.response.status)
  ) {
    return true;
  }

  return false;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class RetryableOperation<T> {
  private options: Required<RetryOptions>;

  constructor(options: RetryOptions = {}) {
    this.options = {
      maxAttempts: 3,
      delay: 1000,
      backoffFactor: 2,
      maxDelay: 10000,
      retryCondition: isRetryableError,
      onRetry: () => {},
      ...options,
    };
  }

  async execute(operation: () => Promise<T>): Promise<T> {
    return withRetry(operation, this.options);
  }

  onRetry(callback: (error: any, attempt: number) => void): this {
    this.options.onRetry = callback;
    return this;
  }

  withCondition(condition: (error: any) => boolean): this {
    this.options.retryCondition = condition;
    return this;
  }

  withDelay(delay: number): this {
    this.options.delay = delay;
    return this;
  }

  withMaxAttempts(maxAttempts: number): this {
    this.options.maxAttempts = maxAttempts;
    return this;
  }
}

export function createRetryableApiCall(
  baseUrl: string,
  timeout: number = 30000,
) {
  return new RetryableOperation({
    maxAttempts: 3,
    delay: 1000,
    onRetry: (error, attempt) => {
      console.log(
        chalk.white(`API call failed (attempt ${attempt}), retrying...`),
      );
      if (error.response?.status) {
        console.log(
          chalk.gray(
            `   HTTP ${error.response.status}: ${error.response.statusText}`,
          ),
        );
      } else if (error.code) {
        console.log(chalk.gray(`   ${error.code}: ${error.message}`));
      }
    },
  });
}
