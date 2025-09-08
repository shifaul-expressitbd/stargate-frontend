import type { Sidebar } from '@/config/routes.config';
import { authApi } from '@/lib/features/auth/authApi';
import type { JWTPayload, TUser } from '@/lib/features/auth/authSlice';
import { logout, setUser } from '@/lib/features/auth/authSlice';
import profileApi from '@/lib/features/profile/profileApi';
import { useAppDispatch } from '@/lib/hooks';
import type { UserProfile } from '@/types/TUserProfile.type';
import { clearTokens, validateStoredTokens, type TokenData } from '@/utils/tokenUtils';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: TUser;
        accessToken: string;
        refreshToken: string;
        hasBusiness?: boolean;
        userProfile?: {
            public_id: string | null;
            optimizeUrl: string | null;
            secure_url: string | null;
        };
        dashboardDesign?: Record<string, boolean>;
        sideBar?: Sidebar[][];
    };
}

/**
 * Helper function to map UserProfile to TUser
 */
const mapUserProfileToTUser = (userProfile: UserProfile): TUser => {
    return {
        id: userProfile._id,
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.picture?.optimizeUrl || null,
        provider: "local", // Default value since not provided in profile
        isEmailVerified: true, // Default value since not provided in profile
        isTwoFactorEnabled: false, // Default value since not provided in profile
        role: userProfile.role,
        warning_date: "", // Default empty value since not provided in profile
    };
};

/**
 * AuthInitializer component - handles token validation and auth state restoration on app load
 */
export const AuthInitializer = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Validate stored tokens
                const tokenValidation = validateStoredTokens();

                if (!tokenValidation.isValid || !tokenValidation.tokens) {
                    console.info('No valid tokens found during initialization');
                    return;
                }

                const { tokens } = tokenValidation;

                // Decode JWT payload
                let jwtPayload: JWTPayload;
                try {
                    jwtPayload = jwtDecode<JWTPayload>(tokens.accessToken);
                } catch (decodeError) {
                    console.error('Error decoding JWT token:', decodeError);
                    clearTokens();
                    return;
                }

                // Check if token is expired (with some buffer)
                const now = Date.now();
                const expiryTime = jwtPayload.exp * 1000;
                const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

                if (now >= (expiryTime - bufferTime)) {
                    console.info('Token expired or expiring soon, attempting refresh');

                    // Try to refresh token
                    try {
                        const refreshResult = await dispatch(
                            authApi.endpoints.refreshToken.initiate(tokens.rememberMe)
                        );

                        if (refreshResult.data && !refreshResult.error) {
                            const refreshData = refreshResult.data as LoginResponse['data'];

                            // Update tokens with fresh ones
                            const refreshedTokens: TokenData = {
                                accessToken: refreshData.accessToken,
                                refreshToken: refreshData.refreshToken,
                                rememberMe: tokens.rememberMe
                            };

                            // Store updated tokens
                            const { storeTokens } = await import('@/utils/tokenUtils');
                            storeTokens(refreshedTokens);

                            // Decode new token
                            const newJwtPayload = jwtDecode<JWTPayload>(refreshData.accessToken);

                            // Dispatch updated auth state
                            dispatch(setUser({
                                user: refreshData.user,
                                jwtPayload: newJwtPayload,
                                token: refreshData.accessToken,
                                refreshToken: refreshData.refreshToken,
                                hasBusiness: refreshData.hasBusiness,
                                userProfile: refreshData.userProfile,
                                dashboardDesign: refreshData.dashboardDesign,
                            }));

                            // Dispatch sidebar if available
                            if (refreshData.sideBar) {
                                const { setSidebar } = await import('@/lib/features/auth/authSlice');
                                dispatch(setSidebar({ sidebar: refreshData.sideBar }));
                            }

                            console.info('Auth state restored with refreshed tokens');

                        } else {
                            console.error('Token refresh failed, logging out');
                            clearTokens();
                            dispatch(logout());
                        }
                    } catch (refreshError) {
                        console.error('Error refreshing token:', refreshError);
                        clearTokens();
                        dispatch(logout());
                    }
                } else {
                    // Token is still valid, try to fetch current user data
                    try {
                        const profileResult = await dispatch(profileApi.endpoints.getProfile.initiate());

                        if (profileResult.data && !profileResult.error) {
                            // Map UserProfile to TUser
                            const userProfile = mapUserProfileToTUser(profileResult.data);
                            const actualUserProfile = {
                                public_id: profileResult.data.picture?.public_id || null,
                                optimizeUrl: profileResult.data.picture?.optimizeUrl || null,
                                secure_url: profileResult.data.picture?.secure_url || null,
                            };

                            dispatch(setUser({
                                user: userProfile,
                                jwtPayload,
                                token: tokens.accessToken,
                                refreshToken: tokens.refreshToken,
                                hasBusiness: true, // Assume has business if profile is available
                                userProfile: actualUserProfile,
                                dashboardDesign: undefined,
                            }));

                            console.info('Auth state restored from valid tokens');

                        } else {
                            console.error('Could not fetch user profile, checking if we should clear tokens');

                            // If profile fetch fails due to auth error, it will trigger the refresh logic
                            // through the baseQuery error handling
                        }
                    } catch (profileError) {
                        console.error('Error fetching user profile:', profileError);
                        // Clear tokens as a safety measure
                        clearTokens();
                        dispatch(logout());
                    }
                }

            } catch (error) {
                console.error('Error during auth initialization:', error);
                // Clear potentially corrupted tokens
                clearTokens();
                dispatch(logout());
            }
        };

        initializeAuth();
    }, [dispatch]);

    return null; // This component doesn't render anything
};