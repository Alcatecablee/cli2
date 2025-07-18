export interface NeuroLintConfig {
    version: string;
    layers: {
        enabled: number[];
        config: Record<number, {
            name: string;
            timeout: number;
            enabled?: boolean;
        }>;
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
export interface AnalyticsData {
    totalAnalyses: number;
    issuesFound: number;
    issuesFixed: number;
    codeQualityScore: number;
    trends: {
        daily: Array<{
            date: string;
            analyses: number;
            issues: number;
        }>;
        weekly: Array<{
            week: string;
            analyses: number;
            issues: number;
        }>;
    };
}
export interface Webhook {
    id: string;
    url: string;
    events: string[];
    active: boolean;
    createdAt: string;
    lastTriggered?: string;
}
export interface AuditEvent {
    id: string;
    timestamp: string;
    userId: string;
    action: string;
    resource: string;
    success: boolean;
}
export interface SSOProvider {
    id: string;
    name: string;
    type: "saml" | "oidc" | "oauth2";
    domain: string;
    enabled: boolean;
    userCount: number;
}
