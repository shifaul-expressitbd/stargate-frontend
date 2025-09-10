import { Button } from '@/components/shared/buttons/button';
import { InputField } from '@/components/shared/forms/input-field';
import OTPInput from '@/components/shared/forms/otp-input';
import type { TChangePasswordRequest } from '@/types/TAuth.type';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';

// Change Password Component
interface ChangePasswordCardProps {
    onChangePassword: (data: TChangePasswordRequest) => any;
    twoFactorEnabled?: boolean;
}

const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({ onChangePassword, twoFactorEnabled = false }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleToggleCurrent = () => setShowCurrentPassword(!showCurrentPassword);
    const handleToggleNew = () => setShowNewPassword(!showNewPassword);
    const handleToggleConfirm = () => setShowConfirmPassword(!showConfirmPassword);

    const handleVerificationCodeChange = (code: string) => {
        setVerificationCode(code);
        if (errors.verificationCode) {
            setErrors(prev => ({ ...prev, verificationCode: '' }));
        }
    };

    const calculatePasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
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
        if (twoFactorEnabled && !verificationCode) {
            newErrors.verificationCode = '2FA verification code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const changePasswordData: TChangePasswordRequest = {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            };

            if (twoFactorEnabled) {
                changePasswordData.code = verificationCode;
            }

            await onChangePassword(changePasswordData).unwrap();
            toast.success('Password changed successfully');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setVerificationCode('');
        } catch (error) {
            toast.error('Failed to change password');
        }
    };

    const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
        const strength = calculatePasswordStrength(password);
        const getStrengthText = (str: number) => {
            if (str === 0) return '';
            if (str <= 2) return 'Weak';
            if (str === 3) return 'Fair';
            if (str === 4) return 'Good';
            return 'Strong';
        };
        const getStrengthColor = (str: number) => {
            if (str <= 2) return 'text-red-400';
            if (str === 3) return 'text-yellow-400';
            if (str === 4) return 'text-blue-400';
            return 'text-green-400';
        };

        if (!password) return null;

        return (
            <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <div
                            key={level}
                            className={`h-1 flex-1 rounded ${level <= strength ? (
                                strength <= 2 ? 'bg-red-500' :
                                    strength === 3 ? 'bg-yellow-500' :
                                        strength === 4 ? 'bg-blue-500' : 'bg-green-500'
                            ) : 'bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
                {strength > 0 && (
                    <p className={`text-sm ${getStrengthColor(strength)}`}>
                        Password strength: {getStrengthText(strength)}
                    </p>
                )}
            </div>
        );
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
                    type={showCurrentPassword ? 'text' : 'password'}
                    label="Current Password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    error={errors.currentPassword}
                    variant="cosmic"
                    required
                    rightElement={
                        <button
                            type="button"
                            onClick={handleToggleCurrent}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer"
                        >
                            {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    }
                />

                <div>
                    <InputField
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        label="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        variant="cosmic"
                        required
                        rightElement={
                            <button
                                type="button"
                                onClick={handleToggleNew}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer"
                            >
                                {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        }
                    />
                    <PasswordStrengthIndicator password={formData.newPassword} />
                </div>

                <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    variant="cosmic"
                    required
                    rightElement={
                        <button
                            type="button"
                            onClick={handleToggleConfirm}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    }
                />

                {/* 2FA Verification Code - only shown when 2FA is enabled */}
                {twoFactorEnabled && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-white font-poppins mb-2">
                                Two-Factor Verification Code
                            </label>
                            <p className="text-cyan-200 font-poppins text-sm mb-4">
                                Enter the 6-digit code from your authenticator app to proceed with password change.
                            </p>
                            <OTPInput
                                onChange={handleVerificationCodeChange}
                                error={errors.verificationCode}
                                className="mb-4"
                            />
                        </div>
                    </div>
                )}

                <Button type="submit" variant="cosmic-primary" title="Change Password">
                    Change Password
                </Button>
            </form>
        </motion.div>
    );
};

export default ChangePasswordCard;