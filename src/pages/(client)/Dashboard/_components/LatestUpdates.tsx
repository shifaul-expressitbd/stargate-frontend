import Collapsible, { CollapsibleGroupProvider } from '@/components/shared/utilities/Collapsible';
import { motion } from 'motion/react';
import { GiPolarStar } from 'react-icons/gi';

const LatestUpdates = () => {
    return (
        <motion.div
            className="bg-black/60 backdrop-blur-md shadow-2xl rounded-xl border border-cyan-400/30 p-6 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
        >
            {/* Glowing Borders */}
            <div className="absolute inset-4 border border-cyan-400/20 rounded-xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

            <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-cyan-500/20 p-2 border border-cyan-400/40">
                    <GiPolarStar className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-white font-asimovian animate-hologram">Latest Dimensional Updates</h3>
                    <p className="text-cyan-200 text-sm font-orbitron">Interdimensional upgrades and enhancements</p>
                </div>
            </div>

            <CollapsibleGroupProvider defaultOpenId={0}>
                <Collapsible
                    id={0}
                    title="Enhanced Wormhole Stability Protocol"
                    date="Phase 9.19"
                >
                    <div className="space-y-2">
                        <p className="text-purple-200 text-sm font-orbitron leading-relaxed">
                            We've improved wormhole connection stability with advanced quantum entanglement protocols.
                            This reduces temporal drift and ensures your data streams travel faster than planetary light speed.
                        </p>
                        <a
                            href="/documentation/getting-started"
                            className="text-cyan-300 hover:text-purple-300 font-orbitron text-shadow-cyan-glow hover:underline text-sm transition-all duration-200"
                        >
                            Quantum connectivity guide →
                        </a>
                    </div>
                </Collapsible>

                <Collapsible
                    id={1}
                    title="Stargate Nova Dimensional Processing"
                    date="Phase 8.43"
                >
                    <div className="space-y-2">
                        <p className="text-purple-200 text-sm font-orbitron leading-relaxed">
                            We're excited to announce Stargate Nova with multidimensional data processing,
                            enhanced quantum security layers, and real-time interdimensional analytics. All existing gateways remain compatible.
                        </p>
                        <a
                            href="/documentation/tracking-templates"
                            className="text-cyan-300 hover:text-purple-300 font-orbitron text-shadow-cyan-glow hover:underline text-sm transition-all duration-200"
                        >
                            Explore infinite dimensions →
                        </a>
                    </div>
                </Collapsible>
            </CollapsibleGroupProvider>
        </motion.div>
    );
};

export default LatestUpdates;