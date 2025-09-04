import AddBtn from '@/components/shared/buttons/AddBtn';
import { motion } from 'motion/react';
import { FaPlus } from 'react-icons/fa';

interface Container {
    id: string;
    name: string;
    domain: string;
    code: string;
    usage: number;
    maxUsage: number;
    package: string;
    statusColor: string;
}

interface ContainerListProps {
    containers: Container[];
    onAddClick: () => void;
}

const ContainerList = ({ containers, onAddClick }: ContainerListProps) => {
    return (
        <motion.div
            className="bg-black/60 backdrop-blur-md shadow-2xl rounded-xl border border-cyan-400/30 p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
        >
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-semibold text-lg text-white font-asimovian animate-hologram">Server Side Google Tag Manager</h3>
                        <p className="text-cyan-200 text-sm font-orbitron">View your recent GTM Containers here</p>
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
                    {containers.map((container) => (
                        <div key={container.id} className="bg-black/40 rounded-lg p-4 border border-cyan-400/20">
                            <a href={`https://app.gtm.io/container/${container.id}`} className="block w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Status Indicator */}
                                        <div className={`animate-pulse w-3 h-3 rounded-full bg-${container.statusColor}-500`}></div>

                                        {/* Container Info */}
                                        <div className="flex items-center gap-3 flex-1">
                                            <img
                                                src={`https://www.google.com/s2/favicons?sz=128&domain=${container.domain}`}
                                                alt={container.domain}
                                                className="w-8 h-8 rounded"
                                            />
                                            <div className="flex-1">
                                                <span className="text-cyan-300 hover:text-white font-orbitron text-sm hover:underline transition-colors">
                                                    {container.name}
                                                </span>
                                                <p className="text-xs text-cyan-400 font-orbitron">{container.code}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Usage */}
                                    <div className="flex mx-4 items-center justify-end">
                                        <div className="text-right mb-1">
                                            <span className="text-xs text-cyan-300 font-orbitron">{container.usage.toLocaleString()} / {container.maxUsage.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-black/40 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(container.usage / container.maxUsage) * 100}%` }}></div>
                                        </div>
                                        {/* Package */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="px-2 py-1 text-xs font-orbitron bg-black/40 border border-green-500 text-green-400 rounded-md uppercase tracking-wider">
                                                {container.package}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Glowing Borders */}
            <div className="absolute inset-4 border border-cyan-400/20 rounded-xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        </motion.div>
    );
};

export default ContainerList;