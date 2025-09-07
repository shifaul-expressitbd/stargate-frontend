import { StatCard } from '@/components/shared/cards/stat-card';
import { motion } from 'motion/react';
import { FaRocket, FaShieldAlt } from 'react-icons/fa';
import { GiPortal } from 'react-icons/gi';

const StatsCards = () => {
    return (
        <motion.div
            className="grid gap-4 grid-cols-1 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <StatCard
                icon={FaRocket}
                value={1}
                label="Active Portals"
                variant="cosmic"
                className="bg-cyan-500/20 border-cyan-500/30 text-cyan-300"
            />
            <StatCard
                icon={GiPortal}
                value={0}
                label="Wormholes Online"
                variant="cosmic"
                className="bg-purple-500/20 border-purple-500/30 text-purple-300"
            />
            <StatCard
                icon={FaShieldAlt}
                value={1}
                label="Gateways Calibrating"
                variant="cosmic"
                className="bg-blue-500/20 border-blue-500/30 text-blue-300"
            />
        </motion.div>
    );
};

export default StatsCards;