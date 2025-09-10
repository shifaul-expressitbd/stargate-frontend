import { Button } from '@/components/shared/buttons/button';
import OTPInput from '@/components/shared/forms/otp-input';
import { ToggleSwitch } from '@/components/shared/forms/toggle-switch';
import type {
    TDisableTwoFactorRequest,
    TEnableTwoFactorRequest,
    TTwoFactorSecretResponse,
    TTwoFactorStatusResponse
} from '@/types/TAuth.type';
import { motion } from 'motion/react';
import React, { useCallback, useState } from 'react';
import { FaCheckCircle, FaUnlock } from 'react-icons/fa';
import { toast } from 'sonner';
import BackupCodesDisplay from './BackupCodesDisplay';
import { SECURITY_TEXT } from './constants';

/**
 * TwoFactorAuthCard Component
 *
 * Comprehensive two-factor authentication management component featuring:
 * - QR code generation and setup flow
 * - Code verification and enable/disable 2FA
 * - Backup codes display and management
 * - Improved error handling and user feedback
 * - Accessibility features and responsive design
 * - Smooth step transitions and loading states
 */
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
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [disableCode, setDisableCode] = useState('');
    const [backupData, setBackupData] = useState<{ success: boolean; message: string; data: { success: boolean; backupCodes: string[] } } | null>(null);
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [showEnableModal, setShowEnableModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleError = useCallback((error: any, defaultMessage: string) => {
        console.error(error);
        let message = defaultMessage;

        if (error?.data?.message) {
            message = error.data.message;
        } else if (error?.message) {
            message = error.message;
        } else if (error?.response?.status === 429) {
            message = 'Too many attempts. Please wait before trying again.';
        } else if (error?.response?.status >= 500) {
            message = 'Server error. Please try again later.';
        } else if (!navigator.onLine) {
            message = 'Network error. Check your internet connection.';
        }

        toast.error(message);
    }, []);

    const handleEnable2FA = useCallback(async (code?: string) => {
        const codeToUse = code || verificationCode;
        if (!codeToUse || codeToUse.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            const result = await onEnable({ code: codeToUse }).unwrap();

            // Store backup data to show afterwards
            if (result && result.data && result.data.backupCodes) {
                setBackupData(result);
            } else {
                // If no backup codes in response, complete the setup
                toast.success('Two-factor authentication enabled successfully');
                setShowEnableModal(false);
                setCurrentStep(1);
                setVerificationCode('');
            }
        } catch (error) {
            handleError(error, 'Failed to enable 2FA');
        } finally {
            setIsLoading(false);
        }
    }, [verificationCode, onEnable, handleError]);

    const handleVerifyTOTP = useCallback(async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            await onVerify({ code: verificationCode }).unwrap();
            await handleEnable2FA(verificationCode);
        } catch (error) {
            handleError(error, 'Invalid TOTP code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [verificationCode, onVerify, handleEnable2FA, handleError]);

    const handleBackupCodesModalClose = useCallback(() => {
        // Close modal and complete setup
        setBackupData(null);
        toast.success('Two-factor authentication enabled successfully');
        setShowEnableModal(false);
        setCurrentStep(1);
        setVerificationCode('');
    }, []);

    const handleDisable2FA = useCallback(async () => {
        if (!disableCode || disableCode.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            await onDisable({ code: disableCode }).unwrap();
            toast.success('Two-factor authentication disabled successfully');
            setDisableCode('');
            setShowDisableModal(false);
        } catch (error) {
            handleError(error, 'Failed to disable 2FA. Please check your code.');
        } finally {
            setIsLoading(false);
        }
    }, [disableCode, onDisable, handleError]);


    const handleToggleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            // Enable 2FA - show setup modal
            setShowEnableModal(true);
            setCurrentStep(1);
            setShouldGenerateSecret(true); // Trigger QR code generation
        } else {
            // Disable 2FA - show verification modal
            setShowDisableModal(true);
            setDisableCode('');
        }
    };

    const isEnabled = status?.data?.isEnabled || false;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-6"
            role="region"
            aria-labelledby="2fa-heading"
        >
            <h3 id="2fa-heading" className="text-2xl font-bold text-white font-orbitron mb-6">
                {SECURITY_TEXT.TWO_FA.TITLE}
            </h3>
            {/* Toggle Switch for 2FA Control */}
            <div className="space-y-6" id="2fa-status-section">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isEnabled ? (
                            <FaCheckCircle className="w-6 h-6 text-green-400" aria-hidden="true" />
                        ) : (
                            <FaUnlock className="w-6 h-6 text-red-400" aria-hidden="true" />
                        )}
                        <div>
                            <h4 className="text-lg font-semibold text-white font-poppins">
                                {SECURITY_TEXT.TWO_FA.TITLE}
                            </h4>
                            <p className="text-cyan-200 font-poppins text-sm">
                                {isEnabled
                                    ? SECURITY_TEXT.TWO_FA.ENABLED_STATUS
                                    : showEnableModal
                                        ? SECURITY_TEXT.TWO_FA.CONFIGURE_PROMPT
                                        : SECURITY_TEXT.TWO_FA.ENABLE_PROMPT
                                }
                            </p>
                        </div>
                    </div>
                    <ToggleSwitch
                        id="2fa-toggle"
                        checked={isEnabled || showEnableModal}
                        onChange={handleToggleChange}
                        disabled={isLoading}
                        loading={isLoading}
                        showStateText={true}
                        size="lg"
                        aria-describedby="2fa-status-section"
                    />
                </div>

                {/* Backup Codes Info - only show when enabled */}
                {isEnabled && (
                    <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-yellow-400 font-poppins mb-2">
                            {SECURITY_TEXT.TWO_FA.BACKUP_CODES_TITLE}
                        </h4>
                        <p className="text-yellow-200 font-poppins text-sm mb-3">
                            {SECURITY_TEXT.TWO_FA.BACKUP_CODES_DESC}
                        </p>
                        <div className="space-y-2 text-sm text-cyan-200">
                            {SECURITY_TEXT.TWO_FA.BACKUP_INFO.map((info, index) => (
                                <p key={index}>• {info}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>




            {/* Backup Codes Modal */}
            {backupData && (
                <BackupCodesDisplay
                    backupData={backupData}
                    onClose={handleBackupCodesModalClose}
                />
            )}

            {/* Enable 2FA Setup Modal */}
            {showEnableModal && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="enable-2fa-modal-title"
                    aria-describedby="enable-2fa-modal-desc"
                >
                    <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-6 max-w-lg w-full"
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="text-center">
                                <h2 id="enable-2fa-modal-title" className="text-2xl font-bold text-white font-orbitron mb-2">
                                    {SECURITY_TEXT.TWO_FA.TITLE}
                                </h2>
                                <p id="enable-2fa-modal-desc" className="text-cyan-200 font-poppins text-sm">
                                    Set up two-factor authentication to secure your account
                                </p>
                            </div>

                            {/* Step Indicator */}
                            <div className="flex justify-center mb-4">
                                <div className="flex space-x-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                                        1
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                                        2
                                    </div>
                                </div>
                            </div>

                            {currentStep === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="text-lg font-semibold text-white font-poppins mb-4">
                                            {SECURITY_TEXT.TWO_FA.SETUP_STEP_ONE}
                                        </h4>
                                        {secret?.data ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-white p-4 rounded-lg block mb-4 mx-auto"
                                            >
                                                <img
                                                    src={secret.data.qrCodeUrl}
                                                    alt="2FA QR Code for authenticator app setup"
                                                    className="w-48 h-48"
                                                />
                                            </motion.div>
                                        ) : (
                                            <div className="text-cyan-200 font-poppins mb-4 text-center">
                                                {SECURITY_TEXT.TWO_FA.GENERATING_QR}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-white font-poppins mb-4">
                                            {SECURITY_TEXT.TWO_FA.MANUAL_ENTRY_TITLE}
                                        </h4>
                                        <p className="text-cyan-200 font-poppins mb-2 text-center">
                                            {SECURITY_TEXT.TWO_FA.MANUAL_ENTRY_DESC} <code className="bg-gray-800 px-2 py-1 rounded text-sm text-center">
                                                {secret?.data?.manualEntryKey || SECURITY_TEXT.TWO_FA.GENERATING_KEY}
                                            </code>
                                        </p>
                                    </div>

                                    <div className="flex gap-4 justify-center">
                                        <Button onClick={() => setCurrentStep(2)} variant="cosmic-primary" title="Next">
                                            Next
                                        </Button>
                                        <Button onClick={() => { setShowEnableModal(false); setCurrentStep(1); setVerificationCode(''); }} disabled={isLoading} variant="cosmic-outline" title={SECURITY_TEXT.TWO_FA.CANCEL_BUTTON}>
                                            {SECURITY_TEXT.TWO_FA.CANCEL_BUTTON}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h4 className="text-lg font-semibold text-white font-poppins mb-4">
                                            {SECURITY_TEXT.TWO_FA.SETUP_STEP_TWO}
                                        </h4>
                                        <p className="text-cyan-200 font-poppins mb-4 text-center">
                                            {SECURITY_TEXT.TWO_FA.VERIFY_PROMPT}
                                        </p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex justify-center"
                                        >
                                            <OTPInput
                                                onChange={setVerificationCode}
                                                onComplete={() => handleVerifyTOTP()}
                                                className="mb-4"
                                            />
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex gap-4 justify-center"
                                        >
                                            <Button onClick={handleVerifyTOTP} variant="cosmic-primary" disabled={!verificationCode || verificationCode.length !== 6} title={SECURITY_TEXT.TWO_FA.VERIFY_BUTTON}>
                                                {SECURITY_TEXT.TWO_FA.VERIFY_BUTTON} (or auto-submits when complete)
                                            </Button>
                                            <Button onClick={() => { setShowEnableModal(false); setCurrentStep(1); setVerificationCode(''); }} disabled={isLoading} variant="cosmic-outline" title={SECURITY_TEXT.TWO_FA.CANCEL_BUTTON}>
                                                {SECURITY_TEXT.TWO_FA.CANCEL_BUTTON}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Disable 2FA Verification Modal */}
            {showDisableModal && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="disable-2fa-modal-title"
                    aria-describedby="disable-2fa-modal-desc"
                >
                    <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-6 max-w-md w-full"
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="text-center">
                                <h2 id="disable-2fa-modal-title" className="text-2xl font-bold text-white font-orbitron mb-2">
                                    {SECURITY_TEXT.DISABLE_MODAL.TITLE}
                                </h2>
                                <p id="disable-2fa-modal-desc" className="text-cyan-200 font-poppins text-sm">
                                    {SECURITY_TEXT.DISABLE_MODAL.DESC}
                                </p>
                            </div>

                            {/* Warning */}
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-red-400 font-poppins mb-2">
                                    {SECURITY_TEXT.DISABLE_MODAL.WARNING_TITLE}
                                </h3>
                                <p className="text-red-200 font-poppins text-sm">
                                    {SECURITY_TEXT.DISABLE_MODAL.WARNING_DESC}
                                </p>
                            </div>

                            {/* TOTP Code Input */}
                            <div>
                                <OTPInput
                                    onChange={setDisableCode}
                                    onComplete={() => handleDisable2FA()}
                                    className="mb-4"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Button
                                    onClick={handleDisable2FA}
                                    variant="cosmic-primary"
                                    size="sm"
                                    disabled={isLoading || !disableCode || disableCode.length !== 6}
                                    className="font-poppins"
                                    title="Confirm disable 2FA"
                                >
                                    {isLoading ? SECURITY_TEXT.TWO_FA.PROCESSING_TEXT : SECURITY_TEXT.TWO_FA.CONFIRM_DISABLE}
                                </Button>

                                <Button
                                    onClick={() => setShowDisableModal(false)}
                                    variant="cosmic-outline"
                                    size="sm"
                                    disabled={isLoading}
                                    className="font-poppins disabled:bg-gray-600 disabled:text-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed"
                                    title="Cancel disable action"
                                >
                                    {SECURITY_TEXT.TWO_FA.CANCEL_BUTTON}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default TwoFactorAuthCard;