// Two-factor authentication types
export interface TTwoFactorSecretResponse {
    success: boolean;
    message: string;
    data: {
        secret: string;
        qrCodeUrl: string;
        manualEntryKey: string;
        otpAuthUrl: string;
    };
}

export interface TTwoFactorVerifyResponse {
    success: boolean;
    message: string;
    data: {
        valid: boolean;
    };
}

export interface TTwoFactorEnableResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        backupCodes: string[];
    };
}

export interface TTwoFactorStatusResponse {
    success: boolean;
    message: string;
    data: {
        isEnabled: boolean;
        hasSecret: boolean;
    };
}

// Change password types
export interface TChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface TChangePasswordResponse {
    success: boolean;
    message: string;
    data: null;
}

// Provider management types
export type TProviderType = 'GOOGLE' | 'FACEBOOK' | 'GITHUB' | 'LOCAL';

export interface TUserProvider {
    id: string;
    provider: TProviderType;
    email: string;
    isPrimary: boolean;
    linkedAt: string;
    lastUsedAt: string;
}

export interface TUserProvidersResponse {
    success: boolean;
    message: string;
    data: TUserProvider[];
}

export interface TUnlinkProviderRequest {
    provider: TProviderType;
}

export interface TUnlinkProviderResponse {
    success: boolean;
    message: string;
    data: null;
}

export interface TSetPrimaryProviderRequest {
    provider: TProviderType;
}

export interface TSetPrimaryProviderResponse {
    success: boolean;
    message: string;
    data: null;
}

// 2FA enable/disable request
export interface TEnableTwoFactorRequest {
    code: string;
    skipBackup?: boolean;
}

export interface TDisableTwoFactorRequest {
    code: string;
    skipBackup?: boolean;
}

// Security overview status
export interface TSecurityStatus {
    twoFactorEnabled: boolean;
    hasBackupCodes: boolean;
    linkedProviders: TUserProvider[];
    lastPasswordChange?: string;
    emailVerified: boolean;
}