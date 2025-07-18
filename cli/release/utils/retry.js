"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryableOperation = void 0;
exports.withRetry = withRetry;
exports.isRetryableError = isRetryableError;
exports.sleep = sleep;
exports.createRetryableApiCall = createRetryableApiCall;
const chalk_1 = __importDefault(require("chalk"));
async function withRetry(operation, options = {}) {
    const { maxAttempts = 3, delay = 1000, backoffFactor = 2, maxDelay = 10000, retryCondition = (error) => isRetryableError(error), onRetry, } = options;
    let lastError;
    let currentDelay = delay;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
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
function isRetryableError(error) {
    if (!error)
        return false;
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
    if (error.response?.status &&
        retryableStatuses.includes(error.response.status)) {
        return true;
    }
    return false;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class RetryableOperation {
    constructor(options = {}) {
        this.options = {
            maxAttempts: 3,
            delay: 1000,
            backoffFactor: 2,
            maxDelay: 10000,
            retryCondition: isRetryableError,
            onRetry: () => { },
            ...options,
        };
    }
    async execute(operation) {
        return withRetry(operation, this.options);
    }
    onRetry(callback) {
        this.options.onRetry = callback;
        return this;
    }
    withCondition(condition) {
        this.options.retryCondition = condition;
        return this;
    }
    withDelay(delay) {
        this.options.delay = delay;
        return this;
    }
    withMaxAttempts(maxAttempts) {
        this.options.maxAttempts = maxAttempts;
        return this;
    }
}
exports.RetryableOperation = RetryableOperation;
function createRetryableApiCall(baseUrl, timeout = 30000) {
    return new RetryableOperation({
        maxAttempts: 3,
        delay: 1000,
        onRetry: (error, attempt) => {
            console.log(chalk_1.default.white(`API call failed (attempt ${attempt}), retrying...`));
            if (error.response?.status) {
                console.log(chalk_1.default.gray(`   HTTP ${error.response.status}: ${error.response.statusText}`));
            }
            else if (error.code) {
                console.log(chalk_1.default.gray(`   ${error.code}: ${error.message}`));
            }
        },
    });
}
