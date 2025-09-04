import { FaExternalLinkAlt, FaShieldAlt } from 'react-icons/fa';
import ServiceStatusItem from './ServiceStatusItem';

interface PlatformStatusProps {
    lastCheck: Date;
}

const PlatformStatus = ({ lastCheck }: PlatformStatusProps) => {
    return (
        <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-xl border border-blue-400/30 p-6 relative overflow-hidden">
            {/* Glowing Borders */}
            <div className="absolute inset-4 border border-blue-400/20 rounded-xl animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute inset-2 border border-cyan-400/15 rounded-xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />

            <div className="flex items-center justify-between mb-4">
                <div className="w-full flex items-center gap-3">
                    <div className="rounded-full bg-blue-500/20 p-2 border border-blue-400/40">
                        <FaShieldAlt className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className='w-full'>
                        <div className="w-full flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-lg text-white font-asimovian animate-hologram">Stargate Status</h3>
                            <span className="text-xs font-orbitron text-green-400">Online</span>
                        </div>
                        <p className="text-blue-200 text-sm font-orbitron">Current multidimensional health</p>
                    </div>
                </div>

            </div>

            {/* Status Details */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-orbitron text-blue-300">Uptime:</span>
                    <span className="font-orbitron text-green-400">99.9%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="font-orbitron text-blue-300">Last Check:</span>
                    <span className="font-orbitron text-cyan-400">{lastCheck.toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Service Indicators */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                <ServiceStatusItem name="Portal" status="operational" />
                <ServiceStatusItem name="API" status="operational" />
                <ServiceStatusItem name="Database" status="operational" />
                <ServiceStatusItem name="Analytics" status="operational" />
            </div>

            {/* External Status Link */}
            <a
                href="https://stargate.io/status"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 w-full justify-center bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-md transition-all text-cyan-300 font-orbitron text-sm font-medium hover:text-white cursor-pointer"
            >
                View Full Status Page
                <FaExternalLinkAlt className="h-3 w-3" />
            </a>
        </div>
    );
};

export default PlatformStatus;