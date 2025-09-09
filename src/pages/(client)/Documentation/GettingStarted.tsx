import { motion } from 'motion/react';
import { FaCog, FaRocket, FaShieldAlt } from 'react-icons/fa';

const GettingStarted = () => {
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
                        Getting Started
                    </h1>
                    <p className="text-purple-200 text-lg font-poppins">
                        Welcome to our multi-dimensional data platform. This guide will help you get started with our portal activation process.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Introduction */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-cyan-500/30">
                        <div className="flex items-center mb-4">
                            <FaRocket className="text-2xl text-blue-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-cyan-300 font-orbitron">
                                Welcome to the Portal
                            </h2>
                        </div>
                        <p className="text-purple-200 leading-relaxed font-poppins mb-4">
                            Our platform provides seamless connectivity across dimensions, allowing you to manage multiple container types with ease.
                            Whether you're setting up sGTM, Meta CAPI, or other tracking solutions, we've got you covered.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-4 bg-black/30 rounded border border-cyan-400/40">
                                <div className="text-3xl text-cyan-400 mb-2">1</div>
                                <h3 className="text-cyan-300 font-semibold mb-2">Activate Portal</h3>
                                <p className="text-xs text-purple-200">Initialize your account</p>
                            </div>
                            <div className="text-center p-4 bg-black/30 rounded border border-purple-400/40">
                                <div className="text-3xl text-purple-400 mb-2">2</div>
                                <h3 className="text-purple-300 font-semibold mb-2">Configure Containers</h3>
                                <p className="text-xs text-purple-200">Set up your tracking</p>
                            </div>
                            <div className="text-center p-4 bg-black/30 rounded border border-blue-400/40">
                                <div className="text-3xl text-blue-400 mb-2">3</div>
                                <h3 className="text-blue-300 font-semibold mb-2">Deploy & Monitor</h3>
                                <p className="text-xs text-purple-200">Launch and track performance</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Quick Setup */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-purple-500/30">
                        <div className="flex items-center mb-4">
                            <FaCog className="text-2xl text-purple-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-purple-300 font-orbitron">
                                Quick Setup Guide
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-400/40 flex-shrink-0">
                                    <span className="text-cyan-300 font-bold">01</span>
                                </div>
                                <div>
                                    <h3 className="text-cyan-300 font-semibold mb-1">Navigate to Products</h3>
                                    <p className="text-purple-200 text-sm">Access the Products section from your dashboard to manage containers.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/40 flex-shrink-0">
                                    <span className="text-purple-300 font-bold">02</span>
                                </div>
                                <div>
                                    <h3 className="text-purple-300 font-semibold mb-1">Add New Container</h3>
                                    <p className="text-purple-200 text-sm">Click "Add Container" to create your first tracking container.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/40 flex-shrink-0">
                                    <span className="text-blue-300 font-bold">03</span>
                                </div>
                                <div>
                                    <h3 className="text-blue-300 font-semibold mb-1">Configure Settings</h3>
                                    <p className="text-purple-200 text-sm">Set up your container with the appropriate configuration for your platform.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Security */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-blue-500/30">
                        <div className="flex items-center mb-4">
                            <FaShieldAlt className="text-2xl text-blue-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-blue-300 font-orbitron">
                                Security & Compliance
                            </h2>
                        </div>
                        <p className="text-purple-200 leading-relaxed font-poppins mb-4">
                            Our platform adheres to the highest security standards, ensuring your data and tracking implementations remain secure.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="text-cyan-300 font-semibold">Encryption Standards</h3>
                                <p className="text-purple-200 text-sm">All data transmission uses industry-standard encryption.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-purple-300 font-semibold">Access Controls</h3>
                                <p className="text-purple-200 text-sm">Role-based access ensures only authorized users can modify settings.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-blue-300 font-semibold">Compliance</h3>
                                <p className="text-purple-200 text-sm">GDPR and CCPA compliant data handling practices.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-green-300 font-semibold">Monitoring</h3>
                                <p className="text-purple-200 text-sm">24/7 security monitoring and threat detection.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GettingStarted;