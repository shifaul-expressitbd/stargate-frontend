/**
 * Token utilities for authentication management
 */

export interface TokenData {
    accessToken: string;
    refreshToken: string;
    rememberMe: boolean;
}

/**
 * Get tokens from storage
 */
export const getStoredTokens = (): TokenData | null => {
    try {
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) return null;

        // Determine rememberMe based on which storage has the tokens
        const rememberMe = localStorage.getItem('accessToken') !== null;

        return {
            accessToken,
            refreshToken,
            rememberMe
        };
    } catch (error) {
        console.error('Error reading tokens from storage:', error);
        return null;
    }
};

/**
 * Store tokens securely
 */
export const storeTokens = (tokens: TokenData): void => {
    try {
        const storage = tokens.rememberMe ? localStorage : sessionStorage;

        storage.setItem('accessToken', tokens.accessToken);
        storage.setItem('refreshToken', tokens.refreshToken);

        // If rememberMe is false, also clear localStorage versions
        if (!tokens.rememberMe) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    } catch (error) {
        console.error('Error storing tokens:', error);
    }
};

/**
 * Clear all tokens from storage
 */
export const clearTokens = (): void => {
    try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('Error clearing tokens:', error);
    }
};

/**
 * Check if a token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        // Decode JWT payload to check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();

        return now >= expiryTime;
    } catch {
        console.error('Error checking token expiry');
        // If we can't decode the token, assume it's expired
        return true;
    }
};

/**
 * Check if stored tokens are valid and not expired
 */
export const validateStoredTokens = (): { isValid: boolean; tokens?: TokenData } => {
    const tokens = getStoredTokens();
    if (!tokens) return { isValid: false };

    const isExpired = isTokenExpired(tokens.accessToken);
    if (isExpired) return { isValid: false };

    return { isValid: true, tokens };
};

/**
 * Get token expiration time in milliseconds
 */
export const getTokenExpiryTime = (token: string): number | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000;
    } catch {
        return null;
    }
};

/**
 * Check if token needs refresh (expires in less than 5 minutes)
 */
export const shouldRefreshToken = (token: string): boolean => {
    const expiryTime = getTokenExpiryTime(token);
    if (!expiryTime) return true;

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return (expiryTime - now) < fiveMinutes;
};