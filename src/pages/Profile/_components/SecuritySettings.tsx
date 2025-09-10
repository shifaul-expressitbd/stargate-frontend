import React, { useState } from 'react';
import { FaKey, FaLock, FaShieldAlt, FaUserFriends } from 'react-icons/fa';

import { Button } from '@/components/shared/buttons/button';
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

import ChangePasswordCard from './ChangePasswordCard';
import LinkedProvidersCard from './LinkedProvidersCard';
import SecurityOverview from './SecurityOverview';
import TwoFactorAuthCard from './TwoFactorAuthCard';

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
                    className="font-poppins flex items-center justify-center gap-2"
                    title="Security Overview"
                >
                    <FaShieldAlt className="w-4 h-4 mr-2" />
                    Overview
                </Button>
                <Button
                    onClick={() => setSelectedSection('2fa')}
                    variant={selectedSection === '2fa' ? 'cosmic-primary' : 'cosmic-outline'}
                    size="sm"
                    className="font-poppins flex items-center justify-center gap-2"
                    title="Two-Factor Authentication Settings"
                >
                    <FaKey className="w-4 h-4 mr-2" />
                    2FA Settings
                </Button>
                <Button
                    onClick={() => setSelectedSection('password')}
                    variant={selectedSection === 'password' ? 'cosmic-primary' : 'cosmic-outline'}
                    size="sm"
                    className="font-poppins flex items-center justify-center gap-2"
                    title="Change Password"
                >
                    <FaLock className="w-4 h-4 mr-2" />
                    Change Password
                </Button>
                <Button
                    onClick={() => setSelectedSection('providers')}
                    variant={selectedSection === 'providers' ? 'cosmic-primary' : 'cosmic-outline'}
                    size="sm"
                    className="font-poppins flex items-center justify-center gap-2"
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
                    hasBackupCodes={false} // TODO: Connect to actual backup codes API endpoint
                    remainingBackupCodes={10} // TODO: Connect to actual remaining count
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
            {selectedSection === 'password' && <ChangePasswordCard onChangePassword={changePassword} twoFactorEnabled={twoFactorStatus?.data?.isEnabled ?? false} />}

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





export default SecuritySettings;