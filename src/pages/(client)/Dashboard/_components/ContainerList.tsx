import { Skeleton } from '@/components/layout/skeleton';
import AddBtn from '@/components/shared/buttons/AddBtn';
import { useGetAllContainersQuery } from '@/lib/features/sgtm-container/sgtmContainerApi';
import { motion } from 'motion/react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Define types based on API spec
interface SgtmContainer {
    id: string;
    name: string;
    fullName: string;
    containerId?: string;
    status: "PENDING" | "RUNNING" | "STOPPED" | "ERROR" | "DELETED";
    subdomain: string;
    config: string;
    region?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface ContainerListProps {
    onAddClick: () => void;
}

// Status color mapping
const getStatusColor = (status: SgtmContainer['status']): string => {
    switch (status) {
        case 'PENDING': return 'yellow';
        case 'RUNNING': return 'green';
        case 'STOPPED': return 'orange';
        case 'ERROR': return 'red';
        case 'DELETED': return 'gray';
        default: return 'gray';
    }
};

const ContainerList = ({ onAddClick }: ContainerListProps) => {
    // Fetch containers using the API hook
    const { data, isLoading, error } = useGetAllContainersQuery();

    const containers = data?.success ? data.data : [];

    // Loading skeleton state
    if (isLoading) {
        return (
            <motion.div
                className="bg-black/60 backdrop-blur-md shadow-2xl rounded-xl border border-cyan-400/30 p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-8 w-full" />
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-black/40 rounded-lg p-4 border border-cyan-400/20">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="w-3 h-3 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Error state
    if (error || !data?.success) {
        return (
            <motion.div
                className="bg-black/60 backdrop-blur-md shadow-2xl rounded-xl border border-red-400/30 p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                <div className="text-center text-red-400">
                    <p className="text-lg font-semibold">Error loading containers</p>
                    <p className="text-sm">Please try again later</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-transparent backdrop-blur-md shadow-2xl rounded-xl border border-cyan-400/30 p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-semibold text-lg text-white font-orbitron animate-hologram">Server Side Google Tag Manager</h3>
                    <p className="text-cyan-200 text-sm font-poppins">View your recent GTM Containers here</p>
                </div>
                <div className="relative z-10">
                    <AddBtn
                        onClick={onAddClick}
                        icon={<FaPlus className="h-4 w-4" />}
                        text="Add container"
                        variant="gradient"
                        showTextOnMobile={true}
                    />
                </div>
            </div>

            {/* Container List */}
            <div className="space-y-4">
                {containers.map((container: SgtmContainer) => (
                    <Link key={container.id} to={`/containers/${container.id}`} className="block w-full">
                        <div className="bg-black/40 rounded-lg p-4 border border-cyan-400/20">
                            <div className="flex items-start gap-4">
                                {/* Status Indicator */}
                                <div className={`animate-pulse w-3 h-3 rounded-full bg-${getStatusColor(container.status)}-500`}></div>

                                {/* Container Info */}
                                <div className="flex-1 space-y-1">
                                    <div>
                                        <span className="text-cyan-300 hover:text-white font-poppins text-sm hover:underline transition-colors">
                                            {container.name}
                                        </span>
                                    </div>
                                    <p className="text-xs text-cyan-400 font-poppins">{container.subdomain}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-poppins bg-black/40 border rounded-md uppercase tracking-wider ${container.status === 'RUNNING' ? 'border-green-500 text-green-400' :
                                            container.status === 'PENDING' ? 'border-yellow-500 text-yellow-400' :
                                                container.status === 'STOPPED' ? 'border-orange-500 text-orange-400' :
                                                    container.status === 'ERROR' ? 'border-red-500 text-red-400' :
                                                        'border-gray-500 text-gray-400'
                                            }`}>
                                            {container.status}
                                        </span>
                                        {container.region && (
                                            <span className="px-2 py-0.5 text-xs font-poppins bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-md">
                                                {container.region}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Usage */}
                                <div className="flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-xs text-cyan-300 font-poppins">
                                            {/* Mock usage data - replace with real data when available */}
                                            {Math.floor(Math.random() * 80) + 1}% {/* Random percentage */}
                                        </span>
                                        <div className="w-16 bg-black/40 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${Math.floor(Math.random() * 80) + 1}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
};

export default ContainerList;