import chalk from "chalk";

export interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  onLimitReached?: (resetTime: number) => void;
}

export class RateLimiter {
  private requests: number[] = [];
  private options: Required<RateLimiterOptions>;

  constructor(options: RateLimiterOptions) {
    this.options = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      onLimitReached: () => {},
      ...options,
    };
  }

  async checkLimit(): Promise<{
    allowed: boolean;
    resetTime: number;
    remaining: number;
  }> {
    const now = Date.now();

    // Remove expired requests
    this.requests = this.requests.filter(
      (time) => now - time < this.options.windowMs,
    );

    if (this.requests.length >= this.options.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const resetTime = oldestRequest + this.options.windowMs;

      if (this.options.onLimitReached) {
        this.options.onLimitReached(resetTime);
      }

      return {
        allowed: false,
        resetTime,
        remaining: 0,
      };
    }

    return {
      allowed: true,
      resetTime: now + this.options.windowMs,
      remaining: this.options.maxRequests - this.requests.length,
    };
  }

  async waitIfNeeded(): Promise<void> {
    const { allowed, resetTime } = await this.checkLimit();

    if (!allowed) {
      const waitTime = resetTime - Date.now();
      if (waitTime > 0) {
        console.log(
          chalk.yellow(
            `⏱ Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`,
          ),
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  recordRequest(successful: boolean = true): void {
    const shouldRecord = successful
      ? !this.options.skipSuccessfulRequests
      : !this.options.skipFailedRequests;

    if (shouldRecord) {
      this.requests.push(Date.now());
    }
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < this.options.windowMs,
    );
    return Math.max(0, this.options.maxRequests - this.requests.length);
  }

  getResetTime(): number {
    if (this.requests.length === 0) return Date.now();
    const oldestRequest = Math.min(...this.requests);
    return oldestRequest + this.options.windowMs;
  }

  reset(): void {
    this.requests = [];
  }
}

export function createApiRateLimiter(requestsPerMinute: number = 60) {
  return new RateLimiter({
    maxRequests: requestsPerMinute,
    windowMs: 60000, // 1 minute
    onLimitReached: (resetTime) => {
      const waitSeconds = Math.ceil((resetTime - Date.now()) / 1000);
      console.log(
        chalk.yellow(
          `🚦 API rate limit reached. Next requests available in ${waitSeconds}s`,
        ),
      );
    },
  });
}

export async function withRateLimit<T>(
  operation: () => Promise<T>,
  rateLimiter: RateLimiter,
): Promise<T> {
  await rateLimiter.waitIfNeeded();

  try {
    const result = await operation();
    rateLimiter.recordRequest(true);
    return result;
  } catch (error) {
    rateLimiter.recordRequest(false);
    throw error;
  }
}
