import type { TUserProvider } from '@/types/TAuth.type';
import { motion } from 'motion/react';
import React from 'react';
import { FaCheckCircle, FaUnlock, FaUserFriends } from 'react-icons/fa';

// Security Overview Component
interface SecurityOverviewProps {
    twoFactorEnabled: boolean;
    linkedProviders: TUserProvider[];
    emailVerified: boolean;
    hasBackupCodes?: boolean;
    remainingBackupCodes?: number;
}

const SecurityOverview: React.FC<SecurityOverviewProps> = ({
    twoFactorEnabled,
    linkedProviders,
    emailVerified,
    hasBackupCodes = false,
    remainingBackupCodes,
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

        {/* Backup Codes Status - only show when 2FA is enabled */}
        {twoFactorEnabled && (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-4"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white font-orbitron mb-2">Backup Codes</h3>
                        <p className="text-cyan-200 font-poppins text-sm">
                            {hasBackupCodes
                                ? `Backup codes available (${remainingBackupCodes ?? 'unknown'} remaining)`
                                : 'No backup codes configured'
                            }
                        </p>
                    </div>
                    <div className="flex items-center">
                        {hasBackupCodes ? (
                            <FaCheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                            <FaUnlock className="w-6 h-6 text-yellow-400" />
                        )}
                    </div>
                </div>
            </motion.div>
        )}

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

export default SecurityOverview;