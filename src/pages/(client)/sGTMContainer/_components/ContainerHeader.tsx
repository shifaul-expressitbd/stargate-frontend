import { Button } from '@/components/shared/buttons/button';
import { Card, CardContent } from '@/components/shared/cards/card';
import { Badge } from '@/components/shared/data-display/badge';
import { Tooltip } from '@/components/shared/data-display/tooltip';
import { FaInfoCircle, FaPause, FaPlay, FaRedo, FaRocket, FaSatellite, FaTrashAlt } from 'react-icons/fa';

interface Container {
    id: string;
    name: string;
    status: string;
    config?: string;
    region?: string;
    updatedAt?: string;
}

interface ContainerHeaderProps {
    container: Container;
}

export const ContainerHeader = ({ container }: ContainerHeaderProps) => {
    return (
        <Card variant="cosmic" className={`${container.status !== 'RUNNING' ? 'border-red-500/20 bg-red-950/10' : 'border-cyan-400/30 bg-transparent'}`}>
            <CardContent className='pt-6'>
                <div className="flex flex-col gap-4">
                    {/* Container Name and Status */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Badge variant={container.status === 'RUNNING' ? 'green' : 'red'} className="capitalize">
                                {container.status.toLowerCase()}
                            </Badge>
                            <div className="flex items-center gap-2 text-white">
                                <FaRocket className=" w-5 h-5" />
                            </div>
                            <h1 className="text-3xl font-orbitron bg-gradient-to-r from-magenta-400 to-cyan-400 bg-clip-text text-white">{container.name}</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="alien-primary" className="flex items-center justify-center p-1" title="Launch container upgrade">
                                <FaRocket className="mr-2" />
                                Upgrade
                            </Button>
                            <Button variant="red-outline" size="sm" title="Delete Container" className="flex items-center justify-center p-1">
                                <FaTrashAlt className="mr-2" />
                                Delete Container
                            </Button>
                            <Button variant="blue-outline" size="sm" title="Restart Container" className="flex items-center justify-center p-1">
                                <FaRedo className="mr-2" />
                                Restart Container
                            </Button>
                            <Button
                                variant={container.status === 'STOPPED' ? 'green-outline' : 'orange-outline'}
                                size="sm"
                                title={container.status === 'STOPPED' ? 'Start Container' : 'Stop Container'} className="flex items-center justify-center p-1"
                            >
                                {container.status === 'STOPPED' ? (
                                    <>
                                        <FaPlay className="mr-2" />
                                        Start Container
                                    </>
                                ) : (
                                    <>
                                        <FaPause className="mr-2" />
                                        Stop Container
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-3 gap-2'>
                        {/* Usage Progress */}
                        <div className="col-span-2 bg-gradient-to-r from-slate-800/40 to-purple-900/40 rounded-lg p-4 border border-magenta-500/30">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-white font-orbitron">120 of 10,000 quantum requests sent</h3>
                                <span className="text-fuchsia-300 font-orbitron">1% used</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2 border border-cyan-500/30">
                                <div className="bg-gradient-to-r from-magenta-400 to-cyan-400 h-3 rounded-full shadow-inner animate-pulse" style={{ width: '1%' }}></div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300 font-orbitron">Refuels in 7 cycles</span>
                                <Tooltip content="Each lunar cycle, you receive 10,000 quantum requests for free. If your container surpasses this limit, it will enter hibernation mode">
                                    <FaSatellite className="text-gray-400 hover:text-magenta-300 cursor-pointer animate-spin" style={{ animationDuration: '10s' }} />
                                </Tooltip>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            {/* Analytics Badge */}
                            <div className="flex items-center gap-3">
                                <Tooltip content="Ad blockers: - | Intelligent tracking prevention: 46 | The number of requests in the current billing period, when Analytics was enabled, that bypassed ad blockers and tracking preventions through advanced server-side tracking. More details in Analytics section.">
                                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                                        <div className="text-green-400">
                                            <FaInfoCircle />
                                        </div>
                                        <span className="text-green-300 font-orbitron text-sm">46 (38.33%) Affected by tracking prevention</span>
                                    </div>
                                </Tooltip>
                            </div>

                            {/* Subscription Info */}
                            <div className="flex gap-4 pt-4 border-t border-gray-700">
                                <div className="bg-gray-800/50 rounded-lg px-4 py-3 border">
                                    <h4 className="text-gray-400 text-xs uppercase font-orbitron tracking-wider">Free</h4>
                                    <p className="text-white font-mono text-sm">Monthly plan</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg px-4 py-3 border">
                                    <h4 className="text-gray-400 text-xs uppercase font-orbitron tracking-wider">Valid till</h4>
                                    <p className="text-white font-mono text-sm">{new Date().getFullYear() + 1}-09-14</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};