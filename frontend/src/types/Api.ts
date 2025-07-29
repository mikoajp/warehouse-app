export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
}

export interface ErrorResponse {
    error: string;
    message?: string;
    code?: number;
}

export interface AuthToken {
    token: string;
    expiresAt?: string;
}