import { Skeleton } from '@/components/layout/skeleton';
import { Button } from '@/components/shared/buttons/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/navigation/tabs';
import { motion } from 'motion/react';
import { FaCogs, FaDatabase, FaFileAlt, FaRedo, FaStop, FaTrash } from 'react-icons/fa';

interface LoadingSkeletonProps {
    formatDate: (dateString: string) => string;
    container?: any; // Replace with proper type
    handleRestartContainer: () => void;
    handleStopContainer: () => void;
    handleDeleteContainer: () => void;
    restartLoading: boolean;
    stopLoading: boolean;
    deleteLoading: boolean;
}

export const LoadingSkeleton = ({
    formatDate,
    container,
    handleRestartContainer,
    handleStopContainer,
    handleDeleteContainer,
    restartLoading,
    stopLoading,
    deleteLoading,
}: LoadingSkeletonProps) => {

    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 p-6"
        >
            <Skeleton className="h-8 w-64" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-cyan-400/30">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        size="sm"
                        variant="blue-primary"
                        onClick={handleRestartContainer}
                        disabled={restartLoading || container?.status === 'DELETED'}
                        title="Restart Container"
                    >
                        <FaRedo className="mr-2" />
                        {restartLoading ? 'Restarting...' : 'Restart'}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleStopContainer}
                        disabled={stopLoading || container?.status !== 'RUNNING'}
                        title="Stop Container"
                    >
                        <FaStop className="mr-2" />
                        {stopLoading ? 'Stopping...' : 'Stop'}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDeleteContainer}
                        disabled={deleteLoading}
                        title="Hard Delete Container"
                        className="!border-red-500 !text-red-400 hover:!bg-red-500/10"
                    >
                        <FaTrash className="mr-2" />
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-xl border border-cyan-400/30 p-6">
                <Tabs defaultValue="config-loader" variant="cosmic">
                    <TabsList className="bg-black/40 border-cyan-400/20">
                        <TabsTrigger value="config-loader">
                            <FaCogs className="mr-2" />
                            Config Loader
                        </TabsTrigger>
                        <TabsTrigger value="access-log">
                            <FaFileAlt className="mr-2" />
                            Access Log
                        </TabsTrigger>
                        <TabsTrigger value="performance">
                            <FaDatabase className="mr-2" />
                            Performance
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="config-loader" className="mt-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-orbitron text-white">Configuration Management</h3>
                            <div className="bg-black/40 rounded-lg p-4 border border-cyan-400/20">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan-300 font-poppins">Current Config Version</span>
                                        <span className="text-cyan-100 bg-cyan-500/20 px-3 py-1 rounded-full text-sm">
                                            v1.0.0
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan-300 font-poppins">Config Status</span>
                                        <span className="text-green-400 bg-green-500/20 px-3 py-1 rounded-full text-sm">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan-300 font-poppins">Last Deployed</span>
                                        <span className="text-cyan-100 text-sm">
                                            {formatDate(container?.updatedAt as string)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="access-log" className="mt-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-orbitron text-white">Access Log</h3>
                            <div className="bg-black/40 rounded-lg p-4 border border-cyan-400/20 max-h-64 overflow-y-auto">
                                <div className="space-y-3 text-xs font-mono">
                                    <div className="text-green-400">[INFO] Container started successfully</div>
                                    <div className="text-cyan-400">[INFO] Configuration loaded</div>
                                    <div className="text-yellow-400">[WARN] Rate limit threshold reached</div>
                                    <div className="text-cyan-400">[INFO] Request processed - 200 OK</div>
                                    <div className="text-green-400">[INFO] Health check passed</div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="mt-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-orbitron text-white">Performance Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-black/40 rounded-lg p-4 border border-cyan-400/20 text-center">
                                    <div className="text-2xl text-cyan-300 font-orbitron">2.1s</div>
                                    <div className="text-xs text-cyan-400 font-poppins">Response Time</div>
                                </div>
                                <div className="bg-black/40 rounded-lg p-4 border border-cyan-400/20 text-center">
                                    <div className="text-2xl text-green-300 font-orbitron">99.8%</div>
                                    <div className="text-xs text-cyan-400 font-poppins">Uptime</div>
                                </div>
                                <div className="bg-black/40 rounded-lg p-4 border border-cyan-400/20 text-center">
                                    <div className="text-2xl text-yellow-300 font-orbitron">1.2K</div>
                                    <div className="text-xs text-cyan-400 font-poppins">Requests/Min</div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    );
};