export const AUTH_TOKEN_KEY = 'authToken';

export const authUtils = {
    getToken: (): string | null => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    setToken: (token: string): void => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },

    removeToken: (): void => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    }
};