import { motion } from 'motion/react';
import { FaCertificate, FaEye, FaFileContract, FaLock, FaShieldAlt, FaUserSecret } from 'react-icons/fa';

const TrustAndSafety = () => {
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
                        Trust & Safety
                    </h1>
                    <p className="text-purple-200 text-lg font-poppins">
                        Your data security and privacy are our top priorities. Learn about our commitment to protecting your information.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Our Commitment */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-cyan-500/30">
                        <div className="flex items-center mb-6">
                            <FaShieldAlt className="text-2xl text-cyan-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-cyan-300 font-orbitron">
                                Our Security Commitment
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <FaLock className="text-xl text-cyan-400" />
                                    <div>
                                        <h3 className="text-cyan-300 font-semibold">End-to-End Encryption</h3>
                                        <p className="text-purple-200 text-sm">All data transmission secured with industry-standard encryption protocols.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaUserSecret className="text-xl text-purple-400" />
                                    <div>
                                        <h3 className="text-purple-300 font-semibold">Privacy by Design</h3>
                                        <p className="text-purple-200 text-sm">Privacy considerations built into every aspect of our platform.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <FaEye className="text-xl text-blue-400" />
                                    <div>
                                        <h3 className="text-blue-300 font-semibold">Transparent Operations</h3>
                                        <p className="text-purple-200 text-sm">Clear visibility into data processing and usage through comprehensive logging.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaCertificate className="text-xl text-green-400" />
                                    <div>
                                        <h3 className="text-green-300 font-semibold">Compliance Certified</h3>
                                        <p className="text-purple-200 text-sm">Regular audits and certifications to maintain highest security standards.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-cyan-500/30 pt-6">
                            <p className="text-purple-200 font-poppins leading-relaxed">
                                We are committed to maintaining the trust of our users by implementing robust security measures,
                                following industry best practices, and ensuring compliance with all relevant data protection regulations.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Data Protection */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-purple-500/30">
                        <div className="flex items-center mb-4">
                            <FaFileContract className="text-2xl text-purple-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-purple-300 font-orbitron">
                                Data Protection & Compliance
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-black/30 rounded border border-purple-400/40">
                                <h3 className="text-purple-300 font-semibold mb-2">GDPR</h3>
                                <p className="text-xs text-purple-200">General Data Protection Regulation</p>
                                <div className="mt-2 text-green-400">✓ Compliant</div>
                            </div>
                            <div className="text-center p-4 bg-black/30 rounded border border-cyan-400/40">
                                <h3 className="text-cyan-300 font-semibold mb-2">CCPA</h3>
                                <p className="text-xs text-purple-200">California Consumer Privacy Act</p>
                                <div className="mt-2 text-green-400">✓ Compliant</div>
                            </div>
                            <div className="text-center p-4 bg-black/30 rounded border border-blue-400/40">
                                <h3 className="text-blue-300 font-semibold mb-2">SOC 2</h3>
                                <p className="text-xs text-purple-200">Service Organization Control</p>
                                <div className="mt-2 text-yellow-400">🔄 In Progress</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-4 border-cyan-400 pl-4">
                                <h3 className="text-cyan-300 font-semibold mb-2">Right to Access</h3>
                                <p className="text-purple-200 text-sm">
                                    Users can request access to their data, obtain copies, and understand how information is processed.
                                </p>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-4">
                                <h3 className="text-purple-300 font-semibold mb-2">Right to Deletion</h3>
                                <p className="text-purple-200 text-sm">
                                    Users can request complete deletion of their personal data under specific circumstances.
                                </p>
                            </div>
                            <div className="border-l-4 border-blue-400 pl-4">
                                <h3 className="text-blue-300 font-semibold mb-2">Data Portability</h3>
                                <p className="text-purple-200 text-sm">
                                    Users can export their data in a machine-readable format for use elsewhere.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Security Measures */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-blue-500/30">
                        <div className="flex items-center mb-4">
                            <FaLock className="text-2xl text-blue-400 mr-3" />
                            <h2 className="text-2xl font-semibold text-blue-300 font-orbitron">
                                Security Measures
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-cyan-300 font-semibold mb-3">Infrastructure Security</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• Multi-zone cloud deployment</li>
                                    <li>• Automated security patches</li>
                                    <li>• Network segmentation</li>
                                    <li>• DDoS protection</li>
                                    <li>• Regular penetration testing</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-purple-300 font-semibold mb-3">Access Controls</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• Multi-factor authentication</li>
                                    <li>• Role-based permissions</li>
                                    <li>• Session timeouts</li>
                                    <li>• Audit logging</li>
                                    <li>• Single sign-on support</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-blue-300 font-semibold mb-3">Data Encryption</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• TLS 1.3 encryption</li>
                                    <li>• Database encryption at rest</li>
                                    <li>• Backup data encryption</li>
                                    <li>• Secure key management</li>
                                    <li>• HSM-backed certificates</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-green-300 font-semibold mb-3">Monitoring & Response</h3>
                                <ul className="space-y-2 text-sm text-purple-200">
                                    <li>• 24/7 security monitoring</li>
                                    <li>• Automated threat detection</li>
                                    <li>• Incident response team</li>
                                    <li>• Security updates</li>
                                    <li>• Vulnerability assessments</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Contact & Support */}
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-6 border border-cyan-500/30">
                        <div className="text-center">
                            <FaShieldAlt className="text-4xl text-cyan-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-cyan-300 font-orbitron mb-4">
                                Questions About Security?
                            </h2>
                            <p className="text-purple-200 mb-6 font-poppins">
                                Our security team is available to address any concerns you may have about data protection and privacy.
                            </p>
                            <div className="bg-black/30 rounded-lg p-4 border border-cyan-400/20 max-w-md mx-auto">
                                <p className="text-purple-200 text-sm mb-2">Security Inquiries:</p>
                                <a
                                    href="mailto:security@stargate.com"
                                    className="text-cyan-300 hover:text-cyan-200 transition-colors"
                                >
                                    security@stargate.com
                                </a>
                                <p className="text-purple-200 text-sm mt-2">Response time: Within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TrustAndSafety;