
import AddBtn from '@/components/shared/buttons/AddBtn';
import { StatCard } from '@/components/shared/cards/stat-card';
import Modal from '@/components/shared/modals/modal';
import Carousel, { type CarouselRef } from '@/components/shared/utilities/Carousel';
import Collapsible, { CollapsibleGroupProvider } from '@/components/shared/utilities/Collapsible';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGoogle, FaPlus, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { GiPolarStar, GiPortal } from "react-icons/gi";
import { MdOutlineTipsAndUpdates } from 'react-icons/md';

const ServiceStatusItem = ({ name, status }: { name: string; status: 'operational' | 'degraded' | 'down' }) => {
    const getStatusClasses = (currentStatus: 'operational' | 'degraded' | 'down') => {
        switch (currentStatus) {
            case 'operational': return 'bg-green-400';
            case 'degraded': return 'bg-yellow-400';
            case 'down': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${getStatusClasses(status)}`}></div>
            <span className="font-orbitron text-cyan-200 truncate">{name}</span>
        </div>
    );
};

const ClientDashboard = () => {
    const { user } = useAuth();
    const carouselRef = useRef<CarouselRef>(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [lastCheck, _setLastCheck] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<'select' | 'manual'>('select');

    // Container data
    const containers = [
        {
            id: 'd94aa791-6bfc-40a3-ac0e-72cf46d96550',
            name: 'meds',
            domain: 'https://meds.com',
            code: 'QNJ3MIpIeU',
            usage: 0,
            maxUsage: 10000,
            package: 'Free',
            statusColor: 'orange'
        },
        {
            id: 'd94aa791-6bfc-40a3-ac0e-72cf46d96551',
            name: 'meds',
            domain: 'https://meds.com',
            code: 'QNJ3MIpIeU',
            usage: 0,
            maxUsage: 10000,
            package: 'Free',
            statusColor: 'orange'
        },
        {
            id: 'd94aa791-6bfc-40a3-ac0e-72cf46d96552',
            name: 'meds',
            domain: 'https://meds.com',
            code: 'QNJ3MIpIeU',
            usage: 0,
            maxUsage: 10000,
            package: 'Free',
            statusColor: 'orange'
        },
        {
            id: 'd94aa791-6bfc-40a3-ac0e-72cf46d96553',
            name: 'meds',
            domain: 'https://meds.com',
            code: 'QNJ3MIpIeU',
            usage: 0,
            maxUsage: 10000,
            package: 'Free',
            statusColor: 'orange'
        },
        {
            id: 'd94aa791-6bfc-40a3-ac0e-72cf46d96554',
            name: 'meds',
            domain: 'https://meds.com',
            code: 'QNJ3MIpIeU',
            usage: 0,
            maxUsage: 10000,
            package: 'Free',
            statusColor: 'orange'
        }
    ];

    // Quick Tips data for carousel
    const quickTipsData = [
        {
            id: '1',
            title: 'Setup',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium tracking-wide uppercase text-cyan-400 font-orbitron text-shadow-cyan-glow">Setup</span>

                        <div className="flex items-center gap-1 text-xs">
                            <button
                                onClick={() => carouselRef.current?.prevSlide()}
                                className="p-1 rounded-full hover:bg-cyan-500/20 transition-colors"
                                aria-label="Previous slide"
                            >
                                <FaChevronLeft className="w-3 h-3 text-cyan-300" />
                            </button>
                            <span className="text-cyan-100">{currentTipIndex + 1} / 4</span>
                            <button
                                onClick={() => carouselRef.current?.nextSlide()}
                                className="p-1 rounded-full hover:bg-cyan-500/20 transition-colors"
                                aria-label="Next slide"
                            >
                                <FaChevronRight className="w-3 h-3 text-cyan-300" />
                            </button>
                        </div>
                    </div>

                    <h4 className="mb-2 font-medium text-white font-asimovian animate-hologram">Calibrate Your Gateway</h4>
                    <p className="text-cyan-200 text-sm leading-relaxed font-orbitron">
                        Set up a custom gateway like 'stargate.yourdomain.com' to improve data transmission speed and bypass quantum interference.
                    </p>
                </div>
            )
        },
        {
            id: '2',
            title: 'Analytics',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">

                        <span className="text-xs font-medium tracking-wide uppercase text-purple-400 font-orbitron text-shadow-purple-strong-glow">Analytics</span>

                        <div className="flex items-center gap-1 text-xs">
                            <button
                                onClick={() => carouselRef.current?.prevSlide()}
                                className="p-1 rounded-full hover:bg-purple-500/20 transition-colors"
                                aria-label="Previous slide"
                            >
                                <FaChevronLeft className="w-3 h-3 text-purple-300" />
                            </button>
                            <span className="text-purple-100">{currentTipIndex + 1} / 4</span>
                            <button
                                onClick={() => carouselRef.current?.nextSlide()}
                                className="p-1 rounded-full hover:bg-purple-500/20 transition-colors"
                                aria-label="Next slide"
                            >
                                <FaChevronRight className="w-3 h-3 text-purple-300" />
                            </button>
                        </div>
                    </div>

                    <h4 className="mb-2 font-medium text-white font-asimovian animate-hologram">Track Dimension Behavior</h4>
                    <p className="text-purple-200 text-sm leading-relaxed font-orbitron">
                        Use event tracking to understand how interdimensional entities interact with your portal and optimize stability.
                    </p>
                </div>
            )
        },
        {
            id: '3',
            title: 'Security',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">

                        <span className="text-xs font-medium tracking-wide uppercase text-red-400 font-orbitron text-shadow-purple-glow">Security</span>

                        <div className="flex items-center gap-1 text-xs">
                            <button
                                onClick={() => carouselRef.current?.prevSlide()}
                                className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                                aria-label="Previous slide"
                            >
                                <FaChevronLeft className="w-3 h-3 text-red-300" />
                            </button>
                            <span className="text-red-100">{currentTipIndex + 1} / 4</span>
                            <button
                                onClick={() => carouselRef.current?.nextSlide()}
                                className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                                aria-label="Next slide"
                            >
                                <FaChevronRight className="w-3 h-3 text-red-300" />
                            </button>
                        </div>
                    </div>

                    <h4 className="mb-2 font-medium text-white font-asimovian animate-hologram">Monitor Wormhole Compliance</h4>
                    <p className="text-red-200 text-sm leading-relaxed font-orbitron">
                        Regularly review your tracking setup to ensure compliance with multidimensional privacy regulations and quantum security standards.
                    </p>
                </div>
            )
        },
        {
            id: '4',
            title: 'Performance',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">

                        <span className="text-xs font-medium tracking-wide uppercase text-blue-400 font-orbitron text-shadow-blue-glow-strong">Performance</span>

                        <div className="flex items-center gap-1 text-xs">
                            <button
                                onClick={() => carouselRef.current?.prevSlide()}
                                className="p-1 rounded-full hover:bg-blue-500/20 transition-colors"
                                aria-label="Previous slide"
                            >
                                <FaChevronLeft className="w-3 h-3 text-blue-300" />
                            </button>
                            <span className="text-blue-100">{currentTipIndex + 1} / 4</span>
                            <button
                                onClick={() => carouselRef.current?.nextSlide()}
                                className="p-1 rounded-full hover:bg-blue-500/20 transition-colors"
                                aria-label="Next slide"
                            >
                                <FaChevronRight className="w-3 h-3 text-blue-300" />
                            </button>
                        </div>
                    </div>

                    <h4 className="mb-2 font-medium text-white font-asimovian animate-hologram">Optimize Portal Load Times</h4>
                    <p className="text-blue-200 text-sm leading-relaxed font-orbitron">
                        Monitor your tracking scripts performance and optimize loading to improve interdimensional connectivity without sacrificing analysis quality.
                    </p>
                </div>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative custom-scroll overflow-y-scroll pb-8"
        >

            <div className="relative z-10 space-y-6 md:pt-20 p-4 md:p-8">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <motion.h1
                            className="text-2xl md:text-4xl font-bold text-white animate-hologram font-asimovian text-shadow-white-strong tracking-[0.2em] capitalize flex gap-2"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Welcome to the Infinite Gateway
                            <span className="block text-2xl md:text-3xl text-cyan-300 font-orbitron capitalize tracking-normal">
                                {user?.name?.split(' ')[0] || 'Commander'}!
                            </span>
                        </motion.h1>
                    </div>
                    <motion.p
                        className="text-lg text-cyan-200 font-orbitron text-shadow-cyan-glow animate-energy-pulse leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Control your multidimensional data flows across infinite realities.
                    </motion.p>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 xl:col-span-2">
                        {/* Dashboard Overview Cards */}
                        <motion.div
                            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <StatCard
                                icon={FaRocket}
                                value={1}
                                label="Active Portals"
                                variant="cosmic"
                                className="bg-cyan-500/20 border-cyan-500/30 text-cyan-300"
                            />
                            <StatCard
                                icon={GiPortal}
                                value={0}
                                label="Wormholes Online"
                                variant="cosmic"
                                className="bg-purple-500/20 border-purple-500/30 text-purple-300"
                            />
                            <StatCard
                                icon={FaShieldAlt}
                                value={1}
                                label="Gateways Calibrating"
                                variant="cosmic"
                                className="bg-blue-500/20 border-blue-500/30 text-blue-300"
                            />
                        </motion.div>

                        {/* Server Side Google Tag Manager Section */}
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
                                            onClick={() => {
                                                console.log('Clicked')
                                                setIsModalOpen(true);
                                                setModalStep('select');
                                            }}
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

                        {/* What's New Section */}
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
                    </div>

                    {/* Right Column */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {/* Quick Tips Section */}
                        <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-xl border border-purple-400/30 p-6 relative overflow-hidden">
                            {/* Glowing Borders */}
                            <div className="absolute inset-4 border border-purple-400/20 rounded-xl animate-pulse" style={{ animationDuration: '3s' }} />
                            <div className="absolute inset-2 border border-cyan-400/15 rounded-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="rounded-full bg-purple-500/20 p-2 border border-purple-400/40 flex items-center justify-center">
                                    <MdOutlineTipsAndUpdates className="h-5 w-5 text-purple-400 " />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-white font-asimovian animate-hologram">Portal Operation Tips</h3>
                                    <p className="text-purple-200 text-sm font-orbitron">Interdimensional best practices</p>
                                </div>
                            </div>

                            <Carousel
                                ref={carouselRef}
                                items={quickTipsData}
                                autoPlay={true}
                                autoPlayInterval={8000}
                                onIndexChange={(index) => setCurrentTipIndex(index)}
                            />
                        </div>

                        {/* Platform Status Section */}
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
                    </motion.div>
                </div>

                {/* Add Container Modal */}
                <Modal
                    isModalOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setModalStep('select');
                    }}
                    variant="themed"
                    title={modalStep === 'select' ? 'Choose Setup Method' : 'Manual Setup'}
                    showFooter={modalStep === 'manual'}
                    confirmText="Add Container"
                >
                    {modalStep === 'select' ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    // Handle automatic setup
                                    setIsModalOpen(false);
                                    setModalStep('select');
                                }}
                                className="w-full flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
                            >
                                <FaGoogle className="h-6 w-6" />
                                <div className="text-left">
                                    <div className="font-semibold">Automatic with Google</div>
                                    <div className="text-sm opacity-90">Connect directly to your Google Account</div>
                                </div>
                            </button>
                            <button
                                onClick={() => setModalStep('manual')}
                                className="w-full flex items-center justify-center gap-4 p-6 bg-base dark:bg-primary-dark border-2 border-primary dark:border-primary-foreground text-primary dark:text-primary-foreground rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
                            >
                                <FaPlus className="h-6 w-6" />
                                <div className="text-left">
                                    <div className="font-semibold">Manual Setup</div>
                                    <div className="text-sm opacity-90">Configure your container manually</div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-orbitron text-primary dark:text-primary-foreground mb-2">Container Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter container name"
                                        className="w-full p-3 bg-base dark:bg-primary-dark border border-primary/30 dark:border-primary-foreground/30 rounded-lg text-primary dark:text-primary-foreground placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-orbitron text-primary dark:text-primary-foreground mb-2">Container ID</label>
                                    <input
                                        type="text"
                                        placeholder="GTM-XXXXXXX"
                                        className="w-full p-3 bg-base dark:bg-primary-dark border border-primary/30 dark:border-primary-foreground/30 rounded-lg text-primary dark:text-primary-foreground placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-orbitron text-primary dark:text-primary-foreground mb-2">Domain</label>
                                    <input
                                        type="text"
                                        placeholder="yourdomain.com"
                                        className="w-full p-3 bg-base dark:bg-primary-dark border border-primary/30 dark:border-primary-foreground/30 rounded-lg text-primary dark:text-primary-foreground placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div >
        </motion.div >
    );

};

export default ClientDashboard;
