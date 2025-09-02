import { setUser, type JWTPayload, type TUser } from '@/lib/features/auth/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ImSpinner10 } from 'react-icons/im';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OAuthCallbackState {
    loading: boolean;
    error: string | null;
    processed: boolean;
}

const OAuthCallback = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState<OAuthCallbackState>({
        loading: true,
        error: null,
        processed: false
    });

    useEffect(() => {
        const handleOAuthCallback = async () => {
            if (state.processed) return;

            try {
                const urlParams = new URLSearchParams(location.search);

                // Check for success parameter
                const success = urlParams.get('success');
                if (success !== 'true') {
                    throw new Error('OAuth authentication failed');
                }

                // Extract and validate tokens
                const accessToken = urlParams.get('token');
                const refreshToken = urlParams.get('refresh');

                if (!accessToken || !refreshToken) {
                    throw new Error('Missing authentication tokens');
                }

                // Decode JWT payload
                let jwtPayload: JWTPayload;
                try {
                    jwtPayload = jwtDecode<JWTPayload>(accessToken);
                } catch (decodeError) {
                    console.error('Error decoding JWT token:', decodeError);
                    throw new Error('Invalid authentication token');
                }

                // Decode user data
                const userParam = urlParams.get('user');
                if (!userParam) {
                    throw new Error('User data missing from OAuth response');
                }

                let user: TUser;
                try {
                    // URL decode the user parameter
                    const decodedUserString = decodeURIComponent(userParam);
                    user = JSON.parse(decodedUserString);
                } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                    throw new Error('Invalid user data from OAuth provider');
                }

                // Store tokens securely
                const storage = jwtPayload.rememberMe ? localStorage : sessionStorage;
                try {
                    storage.setItem('accessToken', accessToken);
                    storage.setItem('refreshToken', refreshToken);
                } catch (storageError) {
                    console.error('Error storing tokens:', storageError);
                    throw new Error('Unable to save authentication data');
                }

                // Clear loading state before dispatching to avoid race conditions
                setState(prev => ({ ...prev, loading: false }));

                // Update authentication state in Redux
                dispatch(setUser({
                    user,
                    jwtPayload,
                    token: accessToken,
                    refreshToken,
                    hasBusiness: user?.provider === 'GOOGLE' || user?.provider === 'GITHUB' ? true : false, // Assume OAuth users have business
                    userProfile: null,
                    dashboardDesign: undefined,
                }));

                // Show success message
                toast.success('OAuth authentication successful!', {
                    id: 'oauth-callback',
                    duration: 200000
                });

                // Determine redirect destination based on roles and business status (same as JWT login logic)
                setTimeout(() => {
                    const destination = '/dashboard';
                    const hasBusiness = user?.provider === 'GOOGLE' || user?.provider === 'GITHUB' ? false : false; // OAuth users typically need business setup

                    if (jwtPayload.roles?.includes('developer') || jwtPayload.roles?.includes('admin')) {
                        navigate(destination, { replace: true });
                    } else if (jwtPayload.roles?.includes('user')) {
                        navigate(hasBusiness ? destination : '/onboarding', {
                            replace: true,
                        });
                    } else {
                        // Default to dashboard if roles are unclear
                        navigate(destination, { replace: true });
                    }
                }, 1000);

                setState(prev => ({ ...prev, processed: true }));

            } catch (error) {
                console.error('OAuth callback error:', error);

                setState({
                    loading: false,
                    error: error instanceof Error ? error.message : 'OAuth authentication failed',
                    processed: false
                });

                toast.error(error instanceof Error ? error.message : 'OAuth authentication failed', {
                    id: 'oauth-callback',
                    duration: 3000
                });

                // Redirect to login page after error
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000);
            }
        };

        handleOAuthCallback();
    }, [location.search, dispatch, navigate, state.processed]);

    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-cyan-400/30 text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                    >
                        <ImSpinner10 size={48} className="text-cyan-400 mb-4" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white animate-hologram font-asimovian mb-2">
                        Entering Quantum Gateway
                    </h2>
                    <p className="text-blue-100 font-orbitron">
                        Validating credentials...
                    </p>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-slate-900 to-red-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-red-400/30 text-center max-w-md"
                >
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white animate-hologram font-asimovian mb-2">
                            Gateway Access Denied
                        </h2>
                        <p className="text-red-200 font-orbitron mb-4">
                            Authentication Failed
                        </p>
                        <p className="text-gray-300 text-sm">
                            {state.error}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-orbitron transition-all duration-200"
                    >
                        Return to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    // Success state with loading redirect
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-slate-900 to-green-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-green-400/30 text-center"
            >
                <div className="mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white animate-hologram font-asimovian mb-2">
                        Quantum Access Granted
                    </h2>
                    <p className="text-green-200 font-orbitron">
                        Authentication successful!
                    </p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <ImSpinner10 className="animate-spin text-green-400" size={20} />
                    <span className="text-gray-300 font-orbitron">Redirecting to dashboard...</span>
                </div>
            </motion.div>
        </div>
    );
};

export default OAuthCallback;