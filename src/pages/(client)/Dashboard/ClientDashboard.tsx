import { useAuth } from '@/hooks/useAuth';
import { motion } from 'motion/react';
import { useState } from 'react';

// Components
import AddContainerModal from './_components/AddContainerModal';
import ContainerList from './_components/ContainerList';
import Header from './_components/Header';
import LatestUpdates from './_components/LatestUpdates';
import PlatformStatus from './_components/PlatformStatus';
import QuickTips from './_components/QuickTips';
import StatsCards from './_components/StatsCards';

const ClientDashboard = () => {
    const { user } = useAuth();
    const [lastCheck, _setLastCheck] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<'select' | 'manual'>('select');


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative custom-scroll overflow-y-scroll p-6 pb-8"
        >
            <div className="relative z-10 space-y-6">
                <Header user={user} />

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <StatsCards />
                        <ContainerList
                            onAddClick={() => {
                                setIsModalOpen(true);
                                setModalStep('select');
                            }}
                        />
                        <LatestUpdates />
                    </div>

                    {/* Right Column */}
                    <motion.div
                        className="space-y-6 lg:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <QuickTips />
                        <PlatformStatus lastCheck={lastCheck} />
                    </motion.div>
                </div>
            </div>

            <AddContainerModal
                isModalOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalStep('select');
                }}
                modalStep={modalStep}
                setModalStep={setModalStep}
            />
        </motion.div>
    );
};

export default ClientDashboard;
