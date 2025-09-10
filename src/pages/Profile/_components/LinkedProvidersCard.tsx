import { Button } from '@/components/shared/buttons/button';
import type { TUserProvider } from '@/types/TAuth.type';
import { motion } from 'motion/react';
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

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

export default LinkedProvidersCard;