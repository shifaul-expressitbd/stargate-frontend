import { motion } from 'motion/react';
import React, { useState } from 'react';
import { FaCheckCircle, FaEdit, FaKey, FaLock, FaShieldAlt, FaTrash, FaUnlock, FaUserFriends } from 'react-icons/fa';

import { Button } from '@/components/shared/buttons/button';
import { InputField } from '@/components/shared/forms/input-field';
import OTPInput from '@/components/shared/forms/otp-input';
import {
    useChangePasswordMutation,
    useDisableTwoFactorMutation,
    useEnableTwoFactorMutation,
    useGenerateTwoFactorSecretQuery,
    useGetTwoFactorStatusQuery,
    useGetUserProvidersQuery,
    useSetPrimaryProviderMutation,
    useUnlinkProviderMutation,
    useVerifyTwoFactorMutation
} from '@/lib/features/auth/authApi';
import { selectCurrentUser } from '@/lib/features/auth/authSlice';
import { useAppSelector } from '@/lib/hooks';
import type {
    TChangePasswordRequest,
    TDisableTwoFactorRequest,
    TEnableTwoFactorRequest,
    TTwoFactorSecretResponse,
    TTwoFactorStatusResponse,
    TUserProvider
} from '@/types/TAuth.type';
import { toast } from 'sonner';

const SecuritySettings: React.FC = () => {
    const [selectedSection, setSelectedSection] = useState<'overview' | '2fa' | 'password' | 'providers'>('overview');

    const currentUser = useAppSelector(selectCurrentUser);
    const { data: twoFactorStatus } = useGetTwoFactorStatusQuery({});
    const [shouldGenerateSecret, setShouldGenerateSecret] = useState(false);
    const { data: twoFactorSecret } = useGenerateTwoFactorSecretQuery("", {
        skip: !shouldGenerateSecret,
    });
    const [enable2FA] = useEnableTwoFactorMutation();
    const [disable2FA] = useDisableTwoFactorMutation();
    const [changePassword] = useChangePasswordMutation();
    const [verify2FA] = useVerifyTwoFactorMutation();
    const { data: providersData } = useGetUserProvidersQuery({});
    const [unlinkProvider] = useUnlinkProviderMutation();
    const [setPrimaryProvider] = useSetPrimaryProviderMutation();

    return (
        <div className="space-y-6">
            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                <Button
                    onClick={() => setSelectedSection('overview')}
                    variant={selectedSection === 'overview' ? 'cosmic-primary' : 'cosmic-outline'}
                    size="sm"
                    className="font-poppins"
                    title="Security Overview"
                >
                    <FaShieldAlt className="w-4 h-4 mr-2" />
                    Overview
                </Button>
                <Button
                    onClick={() => setSelectedSection('2fa')}
                    variant={selectedSection === '2fa' ? 'cosmic-primary' : 'cosmic-outline'}
                    size="sm"
                    className="font-poppins"
                    title="Two-Factor Authentication Settings"
                >
                    <FaKey className="w-4 h-4 mr-2" />
                    2FA Settings
                </Button>
                <Button
                    onClick={() => setSelectedSection('password')}
                    variant={selectedSection === 'password' ? 'cosmic-primary' : 'cosmic-outline'}
                    size="sm"
                    className="font-poppins"
                    title="Change Password"
                >
                    <FaLock className="w-4 h-4 mr-2" />
                    Change Password
                </Button>
                <Button
                    onClick={() => setSelectedSection('providers')}
                    variant={selectedSection === 'providers' ? 'cosmic-primary' : 'cosmic-outline'}
                    size="sm"
                    className="font-poppins"
                    title="Linked Accounts"
                >
                    <FaUserFriends className="w-4 h-4 mr-2" />
                    Linked Accounts
                </Button>
            </div>

            {/* Security Overview */}
            {selectedSection === 'overview' && (
                <SecurityOverview
                    twoFactorEnabled={twoFactorStatus?.data?.isEnabled || false}
                    linkedProviders={providersData?.data || []}
                    emailVerified={(currentUser as any)?.isEmailVerified || false}
                />
            )}

            {/* Two-Factor Authentication */}
            {selectedSection === '2fa' && (
                <TwoFactorAuthCard
                    status={twoFactorStatus}
                    secret={twoFactorSecret}
                    onEnable={enable2FA}
                    onDisable={disable2FA}
                    onVerify={verify2FA}
                    setShouldGenerateSecret={setShouldGenerateSecret}
                />
            )}

            {/* Change Password */}
            {selectedSection === 'password' && <ChangePasswordCard onChangePassword={changePassword} />}

            {/* Linked Providers */}
            {selectedSection === 'providers' && (
                <LinkedProvidersCard
                    providers={providersData?.data || []}
                    onUnlink={unlinkProvider}
                    onSetPrimary={setPrimaryProvider}
                />
            )}
        </div>
    );
};

// Security Overview Component
interface SecurityOverviewProps {
    twoFactorEnabled: boolean;
    linkedProviders: TUserProvider[];
    emailVerified: boolean;
}

const SecurityOverview: React.FC<SecurityOverviewProps> = ({
    twoFactorEnabled,
    linkedProviders,
    emailVerified,
}) => (
    <div className="space-y-4">
        {/* Email Verification Status */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-4"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white font-orbitron mb-2">Email Verification</h3>
                    <p className="text-cyan-200 font-poppins text-sm">
                        {emailVerified ? 'Your email has been verified.' : 'Your email is not verified yet.'}
                    </p>
                </div>
                <div className="flex items-center">
                    {emailVerified ? (
                        <FaCheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                        <FaUnlock className="w-6 h-6 text-red-400" />
                    )}
                </div>
            </div>
        </motion.div>

        {/* Two-Factor Authentication Status */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-4"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white font-orbitron mb-2">Two-Factor Authentication</h3>
                    <p className="text-cyan-200 font-poppins text-sm">
                        {twoFactorEnabled ? 'Two-factor authentication is enabled.' : 'Two-factor authentication is disabled.'}
                    </p>
                </div>
                <div className="flex items-center">
                    {twoFactorEnabled ? (
                        <FaCheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                        <FaUnlock className="w-6 h-6 text-red-400" />
                    )}
                </div>
            </div>
        </motion.div>

        {/* Linked Providers Status */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-4"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white font-orbitron mb-2">Linked Accounts</h3>
                    <p className="text-cyan-200 font-poppins text-sm">
                        {linkedProviders.length > 0
                            ? `${linkedProviders.length} account${linkedProviders.length > 1 ? 's' : ''} linked.`
                            : 'No external accounts linked.'
                        }
                    </p>
                </div>
                <div className="flex items-center">
                    {linkedProviders.length > 0 ? (
                        <FaCheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                        <FaUserFriends className="w-6 h-6 text-orange-400" />
                    )}
                </div>
            </div>
        </motion.div>
    </div>
);

// Two-Factor Authentication Component
interface TwoFactorAuthCardProps {
    status?: TTwoFactorStatusResponse;
    secret?: TTwoFactorSecretResponse;
    onEnable: (data: TEnableTwoFactorRequest) => any;
    onDisable: (data: TDisableTwoFactorRequest) => any;
    onVerify: (data: { code: string }) => any;
    setShouldGenerateSecret: (generate: boolean) => any;
}

const TwoFactorAuthCard: React.FC<TwoFactorAuthCardProps> = ({
    status,
    secret,
    onEnable,
    onDisable,
    onVerify,
    setShouldGenerateSecret,
}) => {
    const [setupMode, setSetupMode] = useState(false);
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [disableCode, setDisableCode] = useState('');

    const handleVerifyTOTP = async () => {
        if (!verificationCode || verificationCode.length !== 6) return;
        try {
            await onVerify({ code: verificationCode }).unwrap();
            toast.success('TOTP code verified successfully');
            setCurrentStep(3);
            setVerificationCode('');
        } catch (error) {
            toast.error('Invalid TOTP code');
        }
    };

    const handleEnable2FA = async () => {
        if (!verificationCode || verificationCode.length !== 6) return;
        try {
            // Enable 2FA without code requirement after successful verification
            await onEnable({ code: verificationCode, skipBackup: true }).unwrap();
            toast.success('Two-factor authentication enabled successfully');
            setSetupMode(false);
            setCurrentStep(1);
            setVerificationCode('');
        } catch (error) {
            toast.error('Failed to enable 2FA');
        }
    };

    const handleDisable2FA = async () => {
        if (!disableCode || disableCode.length !== 6) return;
        try {
            await onDisable({ code: disableCode }).unwrap();
            toast.success('Two-factor authentication disabled successfully');
            setDisableCode('');
        } catch (error) {
            toast.error('Failed to disable 2FA');
        }
    };

    const handleStartSetup = () => {
        setSetupMode(true);
        setCurrentStep(1);
        setShouldGenerateSecret(true); // Trigger QR code generation
    };

    const handleCancelSetup = () => {
        setSetupMode(false);
        setCurrentStep(1);
        setVerificationCode('');
    };

    const isEnabled = status?.data?.isEnabled || false;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-6"
        >
            <h3 className="text-2xl font-bold text-white font-orbitron mb-6">
                Two-Factor Authentication
            </h3>

            {!isEnabled && !setupMode && (
                <div className="space-y-4">
                    <p className="text-cyan-200 font-poppins">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button onClick={handleStartSetup} variant="cosmic-primary" title="Enable 2FA">
                        Enable 2FA
                    </Button>
                </div>
            )}

            {!isEnabled && setupMode && (
                <div className="space-y-6">
                    {/* Step Indicator */}
                    <div className="flex justify-center mb-4">
                        <div className="flex space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                                1
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                                2
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                                3
                            </div>
                        </div>
                    </div>

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-semibold text-white font-poppins mb-4">
                                    Step 1: Generate QR Code
                                </h4>
                                {secret?.data ? (
                                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                                        <img
                                            src={secret.data.qrCodeUrl}
                                            alt="2FA QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-cyan-200 font-poppins mb-4">
                                        Generating QR code...
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-white font-poppins mb-4">
                                    Manual Entry Key
                                </h4>
                                <p className="text-cyan-200 font-poppins mb-2">
                                    If you can't scan the QR code, manually enter this key: <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                                        {secret?.data?.manualEntryKey || 'Generating...'}
                                    </code>
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => setCurrentStep(2)} variant="cosmic-primary" title="Next">
                                    Next
                                </Button>
                                <Button onClick={handleCancelSetup} variant="cosmic-outline" title="Cancel">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-semibold text-white font-poppins mb-4">
                                    Step 2: Verify TOTP Code
                                </h4>
                                <p className="text-cyan-200 font-poppins mb-4">
                                    Enter the 6-digit code from your authenticator app to verify the setup.
                                </p>
                                <OTPInput
                                    onChange={setVerificationCode}
                                    onComplete={() => handleVerifyTOTP()}
                                    className="mb-4"
                                />
                                <div className="flex gap-4">
                                    <Button onClick={handleVerifyTOTP} variant="cosmic-primary" disabled={!verificationCode || verificationCode.length !== 6} title="Verify Code">
                                        Verify Code (or auto-submits when complete)
                                    </Button>
                                    <Button onClick={handleCancelSetup} variant="cosmic-outline" title="Cancel">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <FaCheckCircle className="w-8 h-8 text-green-400" />
                                <p className="text-green-400 font-poppins font-medium">
                                    TOTP code verified successfully!
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-white font-poppins mb-4">
                                    Step 3: Enable 2FA
                                </h4>
                                <p className="text-cyan-200 font-poppins mb-4">
                                    Complete the setup by enabling two-factor authentication.
                                </p>
                                <OTPInput
                                    onChange={setVerificationCode}
                                    onComplete={() => handleEnable2FA()}
                                    className="mb-4"
                                />
                                <div className="flex gap-4">
                                    <Button onClick={handleEnable2FA} variant="cosmic-primary" disabled={!verificationCode || verificationCode.length !== 6} title="Enable 2FA">
                                        Enable 2FA (or auto-submits when complete)
                                    </Button>
                                    <Button onClick={handleCancelSetup} variant="cosmic-outline" title="Cancel">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isEnabled && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <FaCheckCircle className="w-6 h-6 text-green-400" />
                        <p className="text-green-400 font-poppins font-medium">
                            Two-factor authentication is enabled
                        </p>
                    </div>

                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-red-400 font-poppins mb-4">
                            Disable Two-Factor Authentication
                        </h4>
                        <p className="text-red-200 font-poppins mb-4">
                            Disabling 2FA will make your account less secure. We recommend keeping it enabled.
                        </p>
                        <OTPInput
                            onChange={setDisableCode}
                            onComplete={() => handleDisable2FA()}
                            error="This action will reduce your account security"
                            className="mb-4"
                        />
                        <Button
                            onClick={handleDisable2FA}
                            variant="cosmic-outline"
                            disabled={!disableCode || disableCode.length !== 6}
                            title="Disable 2FA"
                        >
                            <FaTrash className="w-4 h-4 mr-2" />
                            Disable 2FA
                        </Button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// Change Password Component
interface ChangePasswordCardProps {
    onChangePassword: (data: TChangePasswordRequest) => any;
}

const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({ onChangePassword }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await onChangePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            }).unwrap();
            toast.success('Password changed successfully');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Failed to change password');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-6"
        >
            <h3 className="text-2xl font-bold text-white font-orbitron mb-6">
                Change Password
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    label="Current Password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    error={errors.currentPassword}
                    variant="cosmic"
                    required
                />

                <InputField
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    label="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                    variant="cosmic"
                    required
                />

                <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    variant="cosmic"
                    required
                />

                <Button type="submit" variant="cosmic-primary" title="Change Password">
                    Change Password
                </Button>
            </form>
        </motion.div>
    );
};

// Linked Providers Component
interface LinkedProvidersCardProps {
    providers: TUserProvider[];
    onUnlink: (provider: string) => any;
    onSetPrimary: (provider: string) => any;
}

const LinkedProvidersCard: React.FC<LinkedProvidersCardProps> = ({
    providers,
    onUnlink,
    onSetPrimary,
}) => {
    const handleUnlink = async (provider: string) => {
        try {
            await onUnlink(provider).unwrap();
            toast.success('Provider unlinked successfully');
        } catch (error) {
            toast.error('Failed to unlink provider');
        }
    };

    const handleSetPrimary = async (provider: string) => {
        try {
            await onSetPrimary(provider).unwrap();
            toast.success('Primary provider updated successfully');
        } catch (error) {
            toast.error('Failed to update primary provider');
        }
    };

    const getProviderDisplayName = (provider: string) => {
        const names = {
            GOOGLE: 'Google',
            FACEBOOK: 'Facebook',
            GITHUB: 'GitHub',
            LOCAL: 'Local Account',
        };
        return names[provider as keyof typeof names] || provider;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-6"
        >
            <h3 className="text-2xl font-bold text-white font-orbitron mb-6">
                Linked Accounts
            </h3>

            {providers.length === 0 ? (
                <p className="text-cyan-200 font-poppins">
                    No external accounts are linked to your profile.
                </p>
            ) : (
                <div className="space-y-4">
                    {providers.map((provider) => (
                        <motion.div
                            key={provider.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-900/60 rounded-lg p-4 border border-gray-600"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">
                                        {provider.provider === 'GOOGLE' && '🌐'}
                                        {provider.provider === 'FACEBOOK' && '📘'}
                                        {provider.provider === 'GITHUB' && '💻'}
                                        {provider.provider === 'LOCAL' && '📧'}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold font-poppins">
                                            {getProviderDisplayName(provider.provider)}
                                        </p>
                                        <p className="text-cyan-200 font-poppins text-sm">
                                            {provider.email}
                                        </p>
                                        {provider.isPrimary && (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded font-poppins">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {!provider.isPrimary && providers.length > 1 && (
                                        <Button
                                            onClick={() => handleSetPrimary(provider.provider)}
                                            variant="cosmic-outline"
                                            size="sm"
                                            title="Set as Primary"
                                        >
                                            <FaEdit className="w-3 h-3 mr-1" />
                                            Primary
                                        </Button>
                                    )}

                                    <Button
                                        onClick={() => handleUnlink(provider.provider)}
                                        variant="cosmic-outline"
                                        size="sm"
                                        title="Unlink Account"
                                        className="border-red-400 text-red-400 hover:bg-red-400/10"
                                    >
                                        <FaTrash className="w-3 h-3 mr-1" />
                                        Unlink
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default SecuritySettings;