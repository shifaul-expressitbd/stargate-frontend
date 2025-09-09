import { motion } from 'motion/react';
import { FaChartBar, FaCode, FaMagic, FaTags } from 'react-icons/fa';

const GTMTemplates = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative custom-scroll overflow-y-scroll p-6 pb-8"
        >
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4 font-orbitron tracking-[0.15em] uppercase">
                        GTM Templates
                    </h1>
                    <p className="text-purple-200 text-lg font-poppins">
                        Accelerate your Google Tag Manager setup with our pre-built templates and configurations.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Template Overview */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-cyan-500/30">
                        <div className="flex items-center mb-4">
                            <FaMagic className="text-2xl text-cyan-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-cyan-300 font-orbitron">
                                Template Gallery
                            </h2>
                        </div>
                        <p className="text-purple-200 leading-relaxed font-poppins mb-6">
                            Discover a comprehensive collection of GTM templates designed to streamline your tag management process.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Template Card */}
                            <div className="bg-black/40 rounded-lg p-4 border border-cyan-400/40 hover:border-cyan-300 transition-all">
                                <div className="flex items-center mb-3">
                                    <FaCode className="text-cyan-400 mr-2" />
                                    <h3 className="text-cyan-300 font-semibold">Universal Analytics</h3>
                                </div>
                                <p className="text-purple-200 text-sm mb-3">
                                    Complete setup for Google Universal Analytics tracking with enhanced e-commerce events.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                                        Popular
                                    </span>
                                    <span className="text-xs text-purple-300">v2.1.0</span>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-lg p-4 border border-purple-400/40 hover:border-purple-300 transition-all">
                                <div className="flex items-center mb-3">
                                    <FaTags className="text-purple-400 mr-2" />
                                    <h3 className="text-purple-300 font-semibold">GA4 Enhanced</h3>
                                </div>
                                <p className="text-purple-200 text-sm mb-3">
                                    Advanced Google Analytics 4 implementation with custom dimensions and events.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                        Recommended
                                    </span>
                                    <span className="text-xs text-purple-300">v3.0.1</span>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-lg p-4 border border-blue-400/40 hover:border-blue-300 transition-all">
                                <div className="flex items-center mb-3">
                                    <FaChartBar className="text-blue-400 mr-2" />
                                    <h3 className="text-blue-300 font-semibold">E-commerce Tracking</h3>
                                </div>
                                <p className="text-purple-200 text-sm mb-3">
                                    Comprehensive e-commerce event tracking for conversion optimization.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                        Business
                                    </span>
                                    <span className="text-xs text-purple-300">v1.8.5</span>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-lg p-4 border border-green-400/40 hover:border-green-300 transition-all">
                                <div className="flex items-center mb-3">
                                    <FaMagic className="text-green-400 mr-2" />
                                    <h3 className="text-green-300 font-semibold">Conversion Seeker</h3>
                                </div>
                                <p className="text-purple-200 text-sm mb-3">
                                    Advanced conversion tracking with attribution modeling and ROI analysis.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                        Advanced
                                    </span>
                                    <span className="text-xs text-purple-300">v2.3.2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Implementation Guide */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-purple-500/30">
                        <div className="flex items-center mb-4">
                            <FaCode className="text-2xl text-purple-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-purple-300 font-orbitron">
                                Implementation Guide
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-4 border-cyan-400 pl-4">
                                <h3 className="text-cyan-300 font-semibold mb-2">Step 1: Template Selection</h3>
                                <p className="text-purple-200 text-sm">
                                    Choose the appropriate template based on your tracking requirements and platform setup.
                                </p>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-4">
                                <h3 className="text-purple-300 font-semibold mb-2">Step 2: Variable Configuration</h3>
                                <p className="text-purple-200 text-sm">
                                    Configure the built-in variables and add any custom variables required for your setup.
                                </p>
                            </div>
                            <div className="border-l-4 border-blue-400 pl-4">
                                <h3 className="text-blue-300 font-semibold mb-2">Step 3: Trigger Setup</h3>
                                <p className="text-purple-200 text-sm">
                                    Define appropriate triggers for your tags to ensure accurate event firing.
                                </p>
                            </div>
                            <div className="border-l-4 border-green-400 pl-4">
                                <h3 className="text-green-300 font-semibold mb-2">Step 4: Testing & Deployment</h3>
                                <p className="text-purple-200 text-sm">
                                    Thoroughly test your setup in Preview mode before deploying to production.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Best Practices */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-blue-500/30">
                        <div className="flex items-center mb-4">
                            <FaMagic className="text-2xl text-blue-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-blue-300 font-orbitron">
                                Best Practices
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-cyan-300 font-semibold mb-3">Naming Conventions</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• Use descriptive names for tags and triggers</li>
                                    <li>• Follow consistent folder organization</li>
                                    <li>• Include version numbers in custom templates</li>
                                    <li>• Document trigger conditions clearly</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-purple-300 font-semibold mb-3">Performance Optimization</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• Minimize unnecessary tag firing</li>
                                    <li>• Use consent management effectively</li>
                                    <li>• Regular audit of unused tags</li>
                                    <li>• Monitor tag load times</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-blue-300 font-semibold mb-3">Data Quality</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• Validate data layer implementation</li>
                                    <li>• Ensure consistent event naming</li>
                                    <li>• Regular data sampling checks</li>
                                    <li>• Cross-browser compatibility testing</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-green-300 font-semibold mb-3">Change Management</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• Document all container changes</li>
                                    <li>• Use workspaces for complex changes</li>
                                    <li>• Establish approval workflows</li>
                                    <li>• Maintain published version backups</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GTMTemplates;