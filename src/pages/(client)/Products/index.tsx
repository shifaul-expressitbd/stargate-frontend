import { motion } from 'motion/react';

// Components from Dashboard
import ContainerList from '../Dashboard/_components/ContainerList';
import StatsCards from '../Dashboard/_components/StatsCards';

const Products = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative custom-scroll overflow-y-scroll p-6 pb-8"
        >
            <div className="relative z-10 space-y-6">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2 font-orbitron">Products</h1>
                    <p className="text-purple-200 font-poppins">Manage your container products including sGTM, Meta CAPI, and more</p>
                </div>

                {/* Stats Cards */}
                <StatsCards />

                {/* Container List */}
                <ContainerList
                    onAddClick={() => {
                        // Modal functionality not implemented yet
                    }}
                />
            </div>

            {/* You can add the modal here if needed, or import it if it's shared */}
        </motion.div>
    );
};

export default Products;