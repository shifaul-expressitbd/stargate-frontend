import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/navigation/tabs';
import { motion } from 'motion/react';
import { FaEdit, FaShieldAlt } from 'react-icons/fa';
import ProfileForm from './_components/ProfileForm';
import SecuritySettings from './_components/SecuritySettings';

export const ProfilePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative custom-scroll overflow-y-scroll p-6 pb-8"
        >
            {/* Page Header */}
            <div className="mb-8 z-10">
                <h1 className="text-4xl font-bold mb-4 text-white font-orbitron text-shadow-white-strong tracking-[0.15em] uppercase">
                    Profile
                </h1>
                <p className="text-cyan-200 font-poppins text-shadow-cyan-glow">
                    Manage your cosmic identity and account configuration
                </p>
            </div>

            <Tabs defaultValue="general" variant="cosmic" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="general" className="font-poppins">
                        <FaEdit className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="font-poppins">
                        <FaShieldAlt className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <ProfileForm />
                </TabsContent>

                <TabsContent value="security">
                    <SecuritySettings />
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

export default ProfilePage;