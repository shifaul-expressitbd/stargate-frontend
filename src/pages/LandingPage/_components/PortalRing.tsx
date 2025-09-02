import { useCallback, useEffect, useState } from "react";

interface Ring {
    id: number;
    size: number;
    rotationSpeed: number;
    glowIntensity: number;
    delay: number;
}

interface TeamActivation {
    teamSize: number;
    activatedCount: number;
    activationTime: number[];
    energyLevel: number;
    isSyncMode: boolean;
    relicMode: 'default' | 'ancient' | 'asgard' | 'ori';
    proximityDetected: boolean;
    activationLevel: number;
}

const PortalRing = () => {
    const [rings, setRings] = useState<Ring[]>([]);
    const [portalPosition, setPortalPosition] = useState({ x: 50, y: 50 });
    const [isOpen, setIsOpen] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [teamActivation, setTeamActivation] = useState<TeamActivation>({
        teamSize: 4,
        activatedCount: 0,
        activationTime: [],
        energyLevel: 0,
        isSyncMode: false,
        relicMode: 'default',
        proximityDetected: false,
        activationLevel: 1,
    });
    const [syncWindow, setSyncWindow] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        setIsDark(document.documentElement.classList.contains('dark'));
        return () => observer.disconnect();
    }, []);

    // Activation handler for team coordination
    const handleActivation = useCallback((teamMember: number) => {
        const currentTime = Date.now();
        setTeamActivation(prev => {
            const newActivationTime = [...prev.activationTime, currentTime];
            const recentActivations = newActivationTime.filter(time => currentTime - time < 2000); // 2-second window
            const activatedCount = recentActivations.length;
            const energyLevel = (activatedCount / prev.teamSize) * 100;

            if (activatedCount >= prev.teamSize && !prev.isSyncMode) {
                // Successful sync
                if (syncWindow) clearTimeout(syncWindow);
                setIsOpen(true);
                // Flash success
                setTimeout(() => setIsOpen(false), 500);
                return {
                    ...prev,
                    activatedCount: 0,
                    activationTime: [],
                    energyLevel: 0,
                    isSyncMode: false,
                };
            } else if (activatedCount > 0 && activatedCount < prev.teamSize) {
                // Start sync window
                if (!prev.isSyncMode) {
                    setSyncWindow(setTimeout(() => {
                        setTeamActivation(prev => ({
                            ...prev,
                            activatedCount: 0,
                            activationTime: [],
                            energyLevel: 0,
                            isSyncMode: false,
                        }));
                        setSyncWindow(null);
                    }, 2000));
                }
            }

            return {
                ...prev,
                activatedCount,
                activationTime: recentActivations,
                energyLevel,
                isSyncMode: activatedCount > 0,
            };
        });
    }, [syncWindow]);

    // Auto-activate random team members for demo (simulate realistic team coordination)
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate team activity with varying timing
            if (Math.random() < 0.3) { // 30% chance per second
                const teamMember = Math.floor(Math.random() * teamActivation.teamSize);
                handleActivation(teamMember);
            }
        }, 1000); // Simulates team coordination timing

        return () => clearInterval(interval);
    }, [handleActivation, teamActivation.teamSize]);

    // Audio and haptic effects for portal activation
    useEffect(() => {
        if (teamActivation.energyLevel >= 100 && teamActivation.isSyncMode) {
            // Simple audio tone for portal activation
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                console.log('Web Audio API not supported');
            }

            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        }
    }, [teamActivation.energyLevel, teamActivation.isSyncMode]);

    // Portal opening/closing animation
    useEffect(() => {
        const interval = setInterval(() => {
            // Close current portal
            setIsOpen(false);

            // Open new portal at new random position after delay
            setTimeout(() => {
                const newPos = {
                    x: Math.random() * 60 + 20, // Keep portals within reasonable bounds (20% to 80%)
                    y: Math.random() * 60 + 20,
                };
                setPortalPosition(newPos);
                setTeamActivation(prev => ({ ...prev, activatedCount: 0, activationTime: [], energyLevel: 0, isSyncMode: false }));
                setIsOpen(false);
            }, 2000);
        }, 6000); // Change portal every 6 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ringData: Ring[] = [];
        for (let i = 0; i < 8; i++) {
            ringData.push({
                id: i,
                size: 100 + i * 50,
                rotationSpeed: 10 + i * 5,
                glowIntensity: 0.3 + i * 0.1,
                delay: i * 0.5,
            });
        }
        setRings(ringData);
    }, []);

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
                transform: `translate(${portalPosition.x - 50}%, ${portalPosition.y - 50}%)`,
                transition: isOpen ? 'transform 2s ease-in-out' : 'none',
                opacity: isOpen ? 1 : 0,
                perspective: '800px',
            }}
        >
            {/* 3D Depth Back Layer */}
            <div
                className="absolute inset-0"
                style={{
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Deep core vortex */}
                <div
                    className={`absolute top-1/2 left-1/2 rounded-full transform-gpu ${isOpen
                        ? 'scale-100 opacity-80'
                        : 'scale-0 opacity-0'
                        }`}
                    style={{
                        width: '120px',
                        height: '120px',
                        marginTop: '-60px',
                        marginLeft: '-60px',
                        background: 'radial-gradient(circle, rgba(0,0,0,0.9) 0%, transparent 60%)',
                        animation: isOpen ? 'portalPulse 3s ease-in-out infinite' : 'none',
                        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
                        transform: isOpen ? 'translate(-50%, -50%) scale(1) rotateX(15deg)' : 'translate(-50%, -50%) scale(0) rotateX(15deg)',
                        transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 1,
                    }}
                />
            </div>

            {/* 3D Portal Rings */}
            {rings.map((ring, index) => (
                <div
                    key={ring.id}
                    className="absolute top-1/2 left-1/2 transform-gpu"
                    style={{
                        width: `${ring.size}px`,
                        height: `${ring.size}px`,
                        marginTop: `-${ring.size / 2}px`,
                        marginLeft: `-${ring.size / 2}px`,
                        transformStyle: 'preserve-3d',
                        zIndex: 10 + index,
                    }}
                >
                    {/* Main ring */}
                    <div
                        className={`absolute inset-0 rounded-full border-2 transform-gpu ${teamActivation.relicMode === 'ancient' ? (isDark ? 'border-green-300/60' : 'border-green-600/60')
                            : teamActivation.relicMode === 'asgard' ? (isDark ? 'border-purple-300/60' : 'border-purple-600/60')
                                : teamActivation.relicMode === 'ori' ? (isDark ? 'border-yellow-300/60' : 'border-yellow-600/60')
                                    : (isDark ? 'border-blue-300/60' : 'border-primary/60')
                            } ${isOpen
                                ? 'scale-100 opacity-100'
                                : 'scale-0 opacity-0'
                            }`}
                        style={{
                            animation: isOpen ? `portalRotate ${ring.rotationSpeed}s linear infinite` : 'none',
                            animationDelay: `${ring.delay}s`,
                            boxShadow: teamActivation.relicMode === 'ancient'
                                ? `0 0 ${20 + ring.size * 0.1}px rgba(16, 185, 129, ${ring.glowIntensity * 0.8 * (isOpen ? 1 : 0)}), 0 0 ${40 + ring.size * 0.2}px rgba(5, 150, 105, 0.6)`
                                : teamActivation.relicMode === 'asgard'
                                    ? `0 0 ${20 + ring.size * 0.1}px rgba(147, 51, 234, ${ring.glowIntensity * 0.8 * (isOpen ? 1 : 0)}), 0 0 ${40 + ring.size * 0.2}px rgba(88, 28, 135, 0.6)`
                                    : teamActivation.relicMode === 'ori'
                                        ? `0 0 ${20 + ring.size * 0.1}px rgba(253, 224, 71, ${ring.glowIntensity * 0.8 * (isOpen ? 1 : 0)}), 0 0 ${40 + ring.size * 0.2}px rgba(161, 98, 7, 0.6)`
                                        : isDark
                                            ? `0 0 ${20 + ring.size * 0.1}px rgba(147, 197, 253, ${ring.glowIntensity * 0.8 * (isOpen ? 1 : 0)}), 0 0 ${40 + ring.size * 0.2}px rgba(0, 0, 51, 0.6)`
                                            : `0 0 ${20 + ring.size * 0.1}px rgba(139, 92, 246, ${ring.glowIntensity * 0.7 * (isOpen ? 1 : 0)}), 0 0 ${40 + ring.size * 0.2}px rgba(46, 0, 92, 0.4)`,
                            transform: `${isOpen ? 'scale(1)' : 'scale(0)'} rotate(${ring.id * 30}deg) rotateX(${Math.sin(ring.id) * 10}deg)`,
                            transition: 'all 1.5s ease-in-out',
                        }}
                    />

                    {/* 3D thickness effect */}
                    <div
                        className={`absolute inset-0 rounded-full border transform-gpu ${isDark ? 'border-blue-400/40' : 'border-primary/40'
                            } ${isOpen
                                ? 'scale-100 opacity-60'
                                : 'scale-0 opacity-0'
                            }`}
                        style={{
                            transform: `translateZ(${(rings.length - ring.id) * 2 + 5}px) rotateY(${ring.id * 5}deg) ${isOpen ? 'scale(1.02)' : 'scale(0)'} rotate(${ring.id * 30}deg)`,
                            boxShadow: isDark
                                ? `0 0 ${15}px rgba(147, 197, 253, ${ring.glowIntensity * 0.3 * (isOpen ? 1 : 0)})`
                                : `0 0 ${15}px rgba(139, 92, 246, ${ring.glowIntensity * 0.3 * (isOpen ? 1 : 0)})`,
                            transition: 'all 1.5s ease-in-out',
                        }}
                    />
                </div>
            ))}

            {/* Enhanced 3D Inner Portal Effect */}
            <div
                className="absolute top-1/2 left-1/2 transform-gpu"
                style={{
                    width: '80px',
                    height: '80px',
                    marginTop: '-40px',
                    marginLeft: '-40px',
                    transformStyle: 'preserve-3d',
                    zIndex: 50,
                }}
            >
                {/* Energy core */}
                <div
                    className={`absolute inset-0 rounded-full border-2 transform-gpu ${isDark
                        ? 'border-gradient-to-r from-blue-200/80 to-purple-300/80'
                        : 'border-gradient-to-r from-primary/80 to-secondary/80'
                        } ${isOpen
                            ? 'scale-100 opacity-100'
                            : 'scale-0 opacity-0'
                        }`}
                    style={{
                        animation: isOpen ? 'portalRotate 5s linear infinite reverse' : 'none',
                        boxShadow: isDark
                            ? `0 0 30px rgba(147, 197, 253, ${isOpen ? 0.8 : 0}), 0 0 60px rgba(0, 0, 51, 0.6)`
                            : `0 0 30px rgba(139, 92, 246, ${isOpen ? 0.8 : 0}), 0 0 60px rgba(46, 0, 92, 0.4)`,
                        background: isDark
                            ? `radial-gradient(circle, rgba(147,197,253,${isOpen ? 0.3 : 0}) 0%, transparent 70%)`
                            : `radial-gradient(circle, rgba(139,92,246,${isOpen ? 0.3 : 0}) 0%, transparent 70%)`,
                        transform: `translate(-50%, -50%) ${isOpen ? 'scale(1)' : 'scale(0)'} rotateX(10deg)`,
                        transition: 'all 1.5s ease-in-out',
                    }}
                />

                {/* Inner vortex rings */}
                {[0, 1, 2].map((depth) => (
                    <div
                        key={depth}
                        className={`absolute inset-0 rounded-full border transform-gpu ${isDark ? 'border-blue-400/20' : 'border-purple-400/20'
                            } ${isOpen
                                ? 'scale-100 opacity-50'
                                : 'scale-0 opacity-0'
                            }`}
                        style={{
                            width: `${60 - depth * 10}px`,
                            height: `${60 - depth * 10}px`,
                            marginTop: `${-(60 - depth * 10) / 2}px`,
                            marginLeft: `${-(60 - depth * 10) / 2}px`,
                            animation: isOpen ? `portalRotate ${4 + depth}s linear infinite ${depth % 2 === 0 ? '' : 'reverse'}` : 'none',
                            transform: `translateZ(${depth * 15}px) rotateX(${10 + depth * 5}deg) ${isOpen ? 'scale(1)' : 'scale(0)'}`,
                            boxShadow: `0 0 ${20 - depth * 5}px rgba(139, 92, 246, ${0.2 * (isOpen ? 1 : 0)})`,
                            transition: 'all 1.5s ease-in-out',
                        }}
                    />
                ))}
            </div>

            {/* Enhanced Particle Field with Depth-of-Field */}
            <div
                className="absolute inset-0"
                style={{
                    background: isDark
                        ? 'radial-gradient(circle at center, rgba(147,197,253,0.1) 0%, transparent 50%)'
                        : 'radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, transparent 50%)',
                    animation: isOpen ? 'portalPulse 4s ease-in-out infinite' : 'none',
                    opacity: isOpen ? 0.6 : 0,
                    transition: 'opacity 2s ease-in-out',
                    filter: isOpen ? 'blur(0px)' : 'blur(2px)',
                }}
            />

            {/* Parallax Layer 1 - Motion Blur Effect */}
            <div
                className={`absolute inset-0 animate-motionBlur ${isOpen ? 'opacity-80' : 'opacity-0'}`}
                style={{
                    background: `linear-gradient(135deg, ${isDark ? 'rgba(147,197,253,0.15)' : 'rgba(139,92,246,0.15)'} 0%, transparent 50%, ${isDark ? 'rgba(96,165,250,0.1)' : 'rgba(167,139,250,0.1)'} 100%)`,
                    transformStyle: 'preserve-3d',
                    transition: 'opacity 3s ease-in-out',
                }}
            />

            {/* Parallax Layer 2 - Energy Bursts */}
            <div
                className={`absolute inset-0 ${isOpen ? 'animate-depthField' : ''}`}
                style={{
                    opacity: isOpen ? 0.4 : 0,
                    transition: 'opacity 2.5s ease-in-out',
                }}
            >
                {/* Energy Bursts */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full animate-energyBurst"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${25 + (i % 3) * 25}%`,
                            width: `${10 + i * 5}px`,
                            height: `${10 + i * 5}px`,
                            background: isDark ? 'rgba(147,197,253,0.6)' : 'rgba(139,92,246,0.6)',
                            filter: 'blur(1px)',
                            animationDelay: `${i * 0.5}s`,
                            transformOrigin: 'center',
                        }}
                    />
                ))}
            </div>

            {/* Parallax Layer 3 - Advanced Particles */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: isOpen ? 0.7 : 0,
                    transition: 'opacity 2s ease-in-out',
                }}
            >
                {/* Enhanced Particle System */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="absolute animate-particleStorm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${2 + Math.random() * 6}px`,
                            height: `${2 + Math.random() * 6}px`,
                            background: isDark ? 'rgba(147,197,253,0.8)' : 'rgba(139,92,246,0.8)',
                            borderRadius: '50%',
                            boxShadow: isDark
                                ? `0 0 ${8}px rgba(147,197,253,0.6)`
                                : `0 0 ${8}px rgba(139,92,246,0.6)`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${8 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Parallax Layer 4 - Depth Field Background */}
            <div
                className={`absolute inset-0 ${isOpen ? 'animate-parallax3' : ''}`}
                style={{
                    opacity: isOpen ? 0.3 : 0,
                    background: `radial-gradient(ellipse at center, ${isDark ? 'rgba(96,165,250,0.05)' : 'rgba(167,139,250,0.05)'} 0%, transparent 70%)`,
                    transition: 'opacity 3.5s ease-in-out',
                }}
            />

            {/* Team Activation UI */}
            {teamActivation.isSyncMode && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
                    {/* Energy Bar */}
                    <div className="w-64 h-4 bg-gray-800/50 rounded-full overflow-hidden border-2 border-cyan-400/30">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                            style={{ width: `${Math.min(teamActivation.energyLevel, 100)}%` }}
                        />
                    </div>
                    <div className="text-white/70 text-sm">
                        Energy: {teamActivation.energyLevel.toFixed(0)}% ({teamActivation.activatedCount}/{teamActivation.teamSize})
                    </div>

                    {/* Activation Buttons */}
                    <div className="flex gap-2">
                        {Array.from({ length: teamActivation.teamSize }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleActivation(i)}
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${teamActivation.activationTime.includes(Date.now() - teamActivation.activationTime[i])
                                    ? 'bg-green-500 border-green-400 animate-pulse'
                                    : teamActivation.isSyncMode
                                        ? 'border-orange-400 bg-orange-500/20 hover:bg-orange-500/40'
                                        : 'border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/40'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    {teamActivation.isSyncMode && (
                        <div className="text-white/50 text-xs">
                            Press buttons in sync within 2 seconds
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PortalRing;