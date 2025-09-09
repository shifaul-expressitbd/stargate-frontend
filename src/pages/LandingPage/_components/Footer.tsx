import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Icon } from '../../../components/shared/icons/icon';
import { Text } from '../../../components/shared/typography/text';

const Footer = () => {
    const socialLinks = [
        { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
        { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: FaEnvelope, href: 'mailto:contact@stargate.app', label: 'Email' },
    ];

    return (
        <footer className="bg-black/90 border-t border-cyan-400/50 py-12 px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-cyan-500/15 rounded-full blur-lg"></div>
            </div>
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md mr-3 border border-cyan-400/50"></div>
                            <Text as="h3" size="lg" className="font-bold text-xl text-cyan-300 font-poppins"
                                style={{
                                    textShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
                                }}>
                                Stargate
                            </Text>
                        </div>
                        <Text className="max-w-xs text-purple-200 leading-relaxed font-poppins" style={{ textShadow: '0 0 5px rgba(147, 51, 234, 0.4)' }}>
                            Empowering interdimensional teams with quantum technology and seamless dimensional collaboration protocols.
                        </Text>
                    </div>

                    {/* Links */}
                    <div>
                        <Text as="h4" className="font-semibold mb-4 text-cyan-300 font-poppins" size="lg">
                            Navigation Matrix
                        </Text>
                        <div className="space-y-3">
                            {['Interdimensional Features', 'Gateway Pricing', 'Quantum Support', 'Cosmic About'].map((link) => (
                                <div key={link}>
                                    <Text variant="muted" className="text-purple-200 hover:text-cyan-300 cursor-pointer transition-all duration-300 hover:translate-x-1 font-poppins" style={{ textShadow: '0 0 5px rgba(147, 51, 234, 0.3)' }}>
                                        {link}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <Text as="h4" className="font-semibold mb-4 text-cyan-300 font-poppins" size="lg">
                            Quantum Connections
                        </Text>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="text-cyan-400/80 hover:text-cyan-300 hover:scale-110 transition-all duration-300 p-2 rounded-full border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-400/10 group"
                                    style={{ filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.2))' }}
                                >
                                    <Icon icon={social.icon} size={20} className="group-hover:animate-pulse" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-cyan-400/20 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <Text variant="muted" size="sm" className="text-purple-200/80 font-poppins">
                        © 2025 Stargate. All interdimensional rights reserved.
                    </Text>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Text variant="muted" size="sm" className="text-cyan-300 hover:text-cyan-200 hover:translate-y-px cursor-pointer transition-all duration-300 font-poppins" style={{ textShadow: '0 0 3px rgba(34, 211, 238, 0.3)' }}>
                            Privacy Matrix
                        </Text>
                        <Text variant="muted" size="sm" className="text-cyan-300 hover:text-cyan-200 hover:translate-y-px cursor-pointer transition-all duration-300 font-poppins" style={{ textShadow: '0 0 3px rgba(34, 211, 238, 0.3)' }}>
                            Quantum Terms
                        </Text>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;