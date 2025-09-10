import { Button } from '@/components/shared/buttons/button';
import type { TTwoFactorEnableResponse } from '@/types/TAuth.type';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { FaCheck, FaCopy, FaDownload, FaEye, FaEyeSlash } from 'react-icons/fa';

interface BackupCodesDisplayProps {
    backupData: TTwoFactorEnableResponse;
    onClose: () => void;
}

const BackupCodesDisplay: React.FC<BackupCodesDisplayProps> = ({ backupData, onClose }) => {
    const [showCodes, setShowCodes] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyToClipboard = async (code: string, index: number) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);

        }
    };

    const downloadCodes = () => {
        if (!backupData.data.backupCodes) return;

        const codesText = `___________2FA_BACKUP_CODES____________\n\n${backupData.data.backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}\n\n__________________________________________________\nGenerated: ${new Date().toLocaleString()}\nIMPORTANT: Store these codes securely!\nUse them only when you cannot access your authenticator app.`;

        const blob = new Blob([codesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '2fa-backup-codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyAllCodes = async () => {
        if (!backupData.data.backupCodes) return;

        const codesText = backupData.data.backupCodes.join('\n');
        try {
            await navigator.clipboard.writeText(codesText);
            setCopiedIndex(-1); // -1 indicates all codes copied
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy all codes:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-black/40 backdrop-blur-md rounded-lg border border-cyan-400/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white font-orbitron mb-2">
                            Backup Codes Generated!
                        </h2>
                        <p className="text-cyan-200 font-poppins text-sm">
                            Save these backup codes in a secure location
                        </p>
                    </div>

                    {/* Warning */}
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-red-400 font-poppins mb-2">
                            ⚠️ Important Security Notice
                        </h3>
                        <ul className="text-red-200 font-poppins text-sm space-y-1">
                            <li>• Each backup code can only be used once</li>
                            <li>• Store these codes in a secure location</li>
                            <li>• Do not share these codes with anyone</li>
                            <li>• If you lose access to your authenticator app, these codes are your only recovery method</li>
                        </ul>
                    </div>

                    {/* Codes Toggle */}
                    <div className="flex justify-center">
                        <Button
                            onClick={() => setShowCodes(!showCodes)}
                            variant="cosmic-outline"
                            size="sm"
                            className="font-poppins"
                            title={showCodes ? "Hide Backup Codes" : "Show Backup Codes"}
                        >
                            {showCodes ? (
                                <>
                                    <FaEyeSlash className="w-4 h-4 mr-2" />
                                    Hide Codes
                                </>
                            ) : (
                                <>
                                    <FaEye className="w-4 h-4 mr-2" />
                                    Show Codes
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Backup Codes */}
                    {showCodes && backupData.data.backupCodes && (
                        <div className="space-y-4">
                            <div className="bg-gray-900/60 rounded-lg border border-gray-600 p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {backupData.data.backupCodes.map((code, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-black/40 rounded border border-gray-700 px-3 py-2"
                                        >
                                            <span className="font-mono text-cyan-300 text-sm">
                                                {code}
                                            </span>
                                            <Button
                                                onClick={() => copyToClipboard(code, index)}
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2 p-1 hover:bg-cyan-600/20"
                                                title={`Copy ${code} to clipboard`}
                                            >
                                                {copiedIndex === index ? (
                                                    <FaCheck className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <FaCopy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {copiedIndex === -1 && (
                                    <div className="text-center mt-3">
                                        <span className="text-green-400 font-poppins text-sm">
                                            All codes copied to clipboard!
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Button
                            onClick={copyAllCodes}
                            variant="cosmic-primary"
                            size="sm"
                            className="font-poppins"
                            title="Copy all backup codes to clipboard"
                        >
                            <FaCopy className="w-4 h-4 mr-2" />
                            Copy All Codes
                        </Button>

                        <Button
                            onClick={downloadCodes}
                            variant="cosmic-outline"
                            size="sm"
                            className="font-poppins"
                            title="Download backup codes as text file"
                        >
                            <FaDownload className="w-4 h-4 mr-2" />
                            Download
                        </Button>

                        <Button
                            onClick={onClose}
                            variant="cosmic-primary"
                            size="sm"
                            className="font-poppins"
                            title="Continue with 2FA setup"
                        >
                            I Understand - Continue
                        </Button>
                    </div>

                    {/* Remaining Codes Info */}
                    {backupData.data.remainingBackupCodes && (
                        <div className="text-center">
                            <p className="text-cyan-300 font-poppins text-sm">
                                Total backup codes remaining: <span className="font-semibold text-white">
                                    {backupData.data.remainingBackupCodes}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BackupCodesDisplay;