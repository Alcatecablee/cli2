interface LoginOptions {
    apiKey?: string;
    url?: string;
}
export declare function loginCommand(options: LoginOptions): Promise<void>;
export declare function logoutCommand(): Promise<void>;
export declare function statusAuth(): Promise<boolean>;
export {};
