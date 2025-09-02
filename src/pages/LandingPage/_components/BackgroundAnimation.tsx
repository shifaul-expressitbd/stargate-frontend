import { useEffect, useRef, useState } from "react";

interface Star {
    id: number;
    x: number;
    y: number;
    delay: number;
    size: number;
}

interface SpaceshipState {
    x: number;
    y: number;
    rotation: number;
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    isActive: boolean;
    patternType: string;
    patternParams: any;
    progress: number;
    totalTime: number;
    portalX: number;
    portalY: number;
    entryPortalX: number;
    entryPortalY: number;
    exitPortalX: number;
    exitPortalY: number;
}

const BackgroundAnimation = () => {
    const [isDark, setIsDark] = useState(false);
    const [stars, setStars] = useState<Star[]>([]);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
    const [largeParticles, setLargeParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
    const [spaceship, setSpaceship] = useState<SpaceshipState>({
        x: 50,
        y: 50,
        rotation: -15,
        velocity: { x: 2, y: -1 },
        acceleration: { x: 0, y: 0 },
        isActive: true,
        patternType: 'spiral',
        patternParams: {},
        progress: 0,
        totalTime: 8,
        portalX: 50,
        portalY: 50,
        entryPortalX: 50,
        entryPortalY: 50,
        exitPortalX: 50,
        exitPortalY: 50,
    });
    const [currentPortalPos, setCurrentPortalPos] = useState({ x: 50, y: 50 });
    const animationFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Generate procedural trajectory patterns
    const generatePattern = () => {
        const patterns = ['spiral', 'zigzag', 'orbital', 'loop', 'dive', 'drift'];
        const patternType = patterns[Math.floor(Math.random() * patterns.length)];
        const params: any = {};

        const startX = Math.random() * 100 - 10; // Start slightly off-screen
        const startY = Math.random() * 100 - 10;

        switch (patternType) {
            case 'spiral':
                params.centerX = Math.random() * 100;
                params.centerY = Math.random() * 100;
                params.initialRadius = Math.random() * 20 + 30;
                params.spiralRate = Math.random() * 2 + 1;
                params.inwardsSpeed = Math.random() * 2 + 1;
                break;
            case 'zigzag':
                params.amplitude = Math.random() * 30 + 10;
                params.frequency = Math.random() * 4 + 2;
                params.startX = startX;
                params.endX = Math.random() * 100 + 20;
                break;
            case 'orbital':
                params.centerX = Math.random() * 100;
                params.centerY = Math.random() * 100;
                params.radiusX = Math.random() * 40 + 20;
                params.radiusY = Math.random() * 40 + 20;
                params.orbitalSpeed = Math.random() * 4 + 2;
                break;
            case 'loop':
                params.centerX = Math.random() * 100;
                params.centerY = Math.random() * 100;
                params.radius = Math.random() * 25 + 15;
                params.loopSpeed = Math.random() * 3 + 1;
                break;
            case 'dive':
                params.startHeight = startY;
                params.diveDepth = Math.random() * 80 + 20;
                params.width = Math.random() * 80 + 40;
                params.diveSpeed = Math.random() * 2 + 1;
                break;
            case 'drift':
                params.numPoints = Math.floor(Math.random() * 3) + 4;
                params.points = [];
                for (let i = 0; i < params.numPoints; i++) {
                    params.points.push({ x: Math.random() * 100, y: Math.random() * 100 });
                }
                params.driftSpeed = Math.random() * 2 + 1;
                break;
        }

        return { patternType, params, startX, startY };
    };

    // Calculate position for pattern at given progress (0-1)
    const getPatternPosition = (patternType: string, params: any, progress: number) => {
        const gravityCenter = { x: 50, y: 50 };
        const gravityStrength = 0.1;

        switch (patternType) {
            case 'spiral':
                const angle = progress * 4 * Math.PI * params.spiralRate;
                const radius = params.initialRadius - progress * params.initialRadius;
                return {
                    x: params.centerX + Math.cos(angle) * radius,
                    y: params.centerY + Math.sin(angle) * radius,
                };
            case 'zigzag':
                const x = params.startX + progress * (params.endX - params.startX);
                const y = params.startY + Math.sin(progress * params.frequency * Math.PI) * params.amplitude;
                return { x, y };
            case 'orbital':
                const orbitalAngle = progress * 2 * Math.PI * params.orbitalSpeed;
                return {
                    x: params.centerX + Math.cos(orbitalAngle) * params.radiusX,
                    y: params.centerY + Math.sin(orbitalAngle) * params.radiusY,
                };
            case 'loop':
                const loopAngle = progress * 4 * Math.PI * params.loopSpeed;
                return {
                    x: params.centerX + Math.cos(loopAngle) * params.radius,
                    y: params.centerY + Math.sin(loopAngle) * params.radius,
                };
            case 'dive':
                const diveProgress = 1 - Math.pow(1 - progress, 2);
                const widthOffset = Math.sin(progress * Math.PI * params.diveSpeed) * params.width / 2;
                return {
                    x: 50 + widthOffset,
                    y: params.startHeight + diveProgress * (params.startHeight - params.diveDepth),
                };
            case 'drift':
                const segment = Math.floor(progress * (params.points.length - 1));
                const segmentProgress = (progress * (params.points.length - 1)) % 1;
                const startPoint = params.points[segment];
                const endPoint = params.points[Math.min(segment + 1, params.points.length - 1)];
                return {
                    x: startPoint.x + segmentProgress * (endPoint.x - startPoint.x),
                    y: startPoint.y + segmentProgress * (endPoint.y - startPoint.y),
                };
            default:
                return { x: 50, y: 50 };
        }
    };

    // Physics simulation with gravity
    const applyPhysics = (state: SpaceshipState, targetX: number, targetY: number, deltaTime: number) => {
        const dx = targetX - state.x;
        const dy = targetY - state.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Attract to gravity center
        const gravityCenter = { x: 50, y: 50 };
        const gravityForce = { x: (gravityCenter.x - state.x) * 0.0001, y: (gravityCenter.y - state.y) * 0.0001 };

        // Update acceleration towards target with physics
        const acceleration = 0.5;
        const maxForce = 0.05;
        const forceX = Math.max(-maxForce, Math.min(maxForce, dx * acceleration));
        const forceY = Math.max(-maxForce, Math.min(maxForce, dy * acceleration));

        state.acceleration.x = forceX + gravityForce.x;
        state.acceleration.y = forceY + gravityForce.y;

        // Update velocity
        state.velocity.x += state.acceleration.x * deltaTime * 60;
        state.velocity.y += state.acceleration.y * deltaTime * 60;

        // Adaptive dampening (deceleration)
        const maxSpeed = 4;
        const speed = Math.sqrt(state.velocity.x ** 2 + state.velocity.y ** 2);
        if (speed > maxSpeed) {
            state.velocity.x = (state.velocity.x / speed) * maxSpeed;
            state.velocity.y = (state.velocity.y / speed) * maxSpeed;
        }

        // Apply dampening near end
        const dampening = state.progress > 0.7 ? 0.98 : 0.999;
        state.velocity.x *= dampening;
        state.velocity.y *= dampening;

        // Update position
        state.x += state.velocity.x * deltaTime * 60;
        state.y += state.velocity.y * deltaTime * 60;

        // Calculate rotation based on velocity
        state.rotation = Math.atan2(state.velocity.y, state.velocity.x) * (180 / Math.PI);
    };

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const dark = document.documentElement.classList.contains('dark');
            setIsDark(dark);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        setIsDark(document.documentElement.classList.contains('dark'));
        return () => observer.disconnect();
    }, []);

    // Generate background elements
    useEffect(() => {
        // Generate random stars
        const newStars: Star[] = [];
        for (let i = 0; i < 150; i++) {
            newStars.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 3,
                size: Math.random() * 2 + 1,
            });
        }
        setStars(newStars);

        // Generate particles
        const newParticles = [];
        for (let i = 0; i < 20; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
            });
        }
        setParticles(newParticles);

        // Generate larger particles
        const newLargeParticles = [];
        for (let i = 0; i < 10; i++) {
            newLargeParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 8 + 4,
            });
        }
        setLargeParticles(newLargeParticles);
    }, []);

    // Procedural spaceship trajectories with physics and portal coordination
    useEffect(() => {
        const generateTrajectory = () => {
            const { patternType, params, startX, startY } = generatePattern();

            // Calculate portal position at 75% progress
            const targetPos = getPatternPosition(patternType, params, 0.75);

            // Calculate entry and exit positions
            const entryPos = getPatternPosition(patternType, params, 0);
            const exitPos = getPatternPosition(patternType, params, 1);

            setSpaceship({
                x: startX,
                y: startY,
                rotation: 0,
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0 },
                isActive: true,
                patternType,
                patternParams: params,
                progress: 0,
                totalTime: Math.random() * 4 + 4, // 4-8 seconds
                portalX: Math.max(10, Math.min(90, targetPos.x)),
                portalY: Math.max(10, Math.min(90, targetPos.y)),
                entryPortalX: Math.max(10, Math.min(90, entryPos.x)),
                entryPortalY: Math.max(10, Math.min(90, entryPos.y)),
                exitPortalX: Math.max(10, Math.min(90, exitPos.x)),
                exitPortalY: Math.max(10, Math.min(90, exitPos.y)),
            });

            // Sync portal position
            setTimeout(() => {
                const portalPos = getPatternPosition(patternType, params, 0.75);
                setCurrentPortalPos({
                    x: Math.max(10, Math.min(90, portalPos.x)),
                    y: Math.max(10, Math.min(90, portalPos.y))
                });
            }, 2500);
        };

        const animate = (currentTime: number) => {
            const deltaTime = (currentTime - lastTimeRef.current) / 1000;
            lastTimeRef.current = currentTime;

            setSpaceship(currentState => {
                if (!currentState.isActive) return currentState;

                const newState = { ...currentState };
                newState.progress += deltaTime / newState.totalTime;

                if (newState.progress >= 1) {
                    // Reset for new trajectory
                    setTimeout(() => generateTrajectory(), 2000);
                    newState.isActive = false;
                    newState.progress = 1;
                } else {
                    // Calculate target position and apply physics
                    const targetPos = getPatternPosition(newState.patternType, newState.patternParams, newState.progress);
                    applyPhysics(newState, targetPos.x, targetPos.y, deltaTime);
                }

                return newState;
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        generateTrajectory();
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div className="fixed w-screen h-dvh overflow-hidden pointer-events-none z-0">
            {/* Parallax Background Layer 1 - Slow moving stars */}
            <div
                className="absolute inset-0"
                style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden',
                }}
            >
                {stars.slice(0, 75).map((star) => (
                    <div
                        key={star.id}
                        className={`absolute rounded-full animate-floatLarge ${isDark ? 'bg-white/60' : 'bg-blue-600/80'}`}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDelay: `${star.delay * 2}s`,
                            animationDuration: `${4 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Parallax Background Layer 2 - Fast particles */}
            <div
                className="absolute inset-0"
                style={{
                    transform: 'translate3d(0, 0, 0.1px)',
                    backfaceVisibility: 'hidden',
                }}
            >
                {stars.slice(75).map((star) => (
                    <div
                        key={star.id}
                        className={`absolute rounded-full animate-floatParticle ${isDark ? 'bg-blue-400/40' : 'bg-purple-600/60'}`}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size * 1.5}px`,
                            height: `${star.size * 1.5}px`,
                            animationDelay: `${star.delay}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Enhanced Particle Fonts */}
            {particles.map((particle, index) => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full animate-floatParticle ${isDark ? 'bg-blue-400/80' : 'bg-primary/60'
                        }`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDelay: `${Math.random() * 8}s`,
                        animationDuration: `${6 + Math.random() * 4}s`,
                        filter: 'blur(0.5px)',
                    }}
                />
            ))}

            {/* Glowing particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full blur-sm animate-floatParticle ${isDark ? 'bg-blue-400/80' : 'bg-primary/60'
                        }`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDelay: `${Math.random() * 8}s`,
                    }}
                />
            ))}

            {/* Larger particles */}
            {largeParticles.map((particle) => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full animate-floatLarge ${isDark
                        ? 'bg-gradient-to-r from-blue-300/30 to-purple-400/30'
                        : 'bg-gradient-to-r from-primary/30 to-secondary/30'
                        }`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animationDelay: `${Math.random() * 12}s`,
                    }}
                />
            ))}

            {/* Enhanced Spaceship with Physics-Based Trajectory */}
            <div
                className={`absolute opacity-80 animate-spaceship transform-gpu ${spaceship.isActive ? 'animate-motionBlur' : 'opacity-0'}`}
                style={{
                    left: `${spaceship.x}%`,
                    top: `${spaceship.y}%`,
                    transform: `translate(-50%, -50%) ${spaceship.isActive ? 'scale(1)' : 'scale(0.8)'} rotate(${spaceship.rotation}deg)`,
                    transition: spaceship.isActive ? 'transform 0.1s linear' : 'none',
                }}
            >
                {/* Advanced Spaceship Design */}
                <div className="relative transform-gpu" style={{
                    transform: 'translate(-50%, -50%)',
                    transformOrigin: 'center',
                }}>

                    {/* Main Hull */}
                    <div className={`relative w-20 h-10 transform-gpu ${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-800 to-gray-900'
                        } rounded-lg border shadow-2xl`}>
                        {/* Cockpit Window */}
                        <div className="absolute top-1 left-2 w-4 h-3 bg-gradient-to-br from-cyan-400/80 to-blue-500/80 rounded-md border border-white/20">
                            <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5 opacity-70"></div>
                        </div>

                        {/* Engine Glow */}
                        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-lg shadow-orange-500/60 animate-pulse"></div>
                        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>

                        {/* Details */}
                        <div className="absolute top-1 right-2 w-2 h-1 bg-red-500/80 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-1 left-1/3 w-8 h-1 bg-gradient-to-r from-yellow-300 to-green-300 opacity-70"></div>

                        {/* Wings */}
                        <div className="absolute -top-2 left-0 w-12 h-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-tl-sm transform rotate-12"></div>
                        <div className="absolute -bottom-2 left-0 w-12 h-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-bl-sm transform -rotate-12"></div>
                        <div className="absolute -top-2 right-0 w-12 h-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-tr-sm transform -rotate-12"></div>
                        <div className="absolute -bottom-2 right-0 w-12 h-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-br-sm transform rotate-12"></div>
                    </div>

                    {/* Enhanced Hyperdrive Trails */}
                    <div className="absolute -left-20 top-1/4 transform -translate-y-1/2">
                        <div className={`w-20 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 animate-pulse blur-sm ${spaceship.isActive ? 'animate-floatParticle' : ''
                            }`}></div>
                        <div className={`w-16 h-1.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-70 animate-pulse blur-sm ${spaceship.isActive ? 'animate-floatParticle' : ''
                            }`} style={{ animationDelay: '0.1s' }}></div>
                        <div className={`w-12 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 animate-pulse blur-sm ${spaceship.isActive ? 'animate-floatParticle' : ''
                            }`} style={{ animationDelay: '0.2s' }}></div>
                    </div>

                    <div className="absolute -right-16 top-3/4 transform -translate-y-1/2">
                        <div className={`w-16 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent opacity-80 animate-pulse blur-sm ${spaceship.isActive ? 'animate-floatParticle' : ''
                            }`}></div>
                        <div className={`w-12 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-transparent opacity-60 animate-pulse blur-sm ${spaceship.isActive ? 'animate-floatParticle' : ''
                            }`} style={{ animationDelay: '0.15s' }}></div>
                    </div>

                    {/* Engine Exhaust Particles */}
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-0.5 h-0.5 bg-yellow-400 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-0.5 h-0.5 bg-red-500 rounded-full animate-ping opacity-70" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Random Energy Disruptions */}
                    <div className={`absolute -left-12 top-0 w-3 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60 ${spaceship.isActive ? 'animate-bounce' : ''
                        }`} style={{
                            animationDelay: Math.random() * 3 + 's',
                            transform: `scale(${0.5 + Math.random() * 1})`,
                        }}></div>

                    <div className={`absolute -right-8 top-8 w-2 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-50 ${spaceship.isActive ? 'animate-spin' : ''
                        }`} style={{
                            animationDelay: Math.random() * 4 + 's',
                            animationDuration: '4s',
                            transform: `scale(${0.5 + Math.random() * 0.8})`,
                        }}></div>

                </div>

                {/* Dynamic Energy Field Around Spaceship */}
                <div className={`absolute -inset-6 rounded-full border-2 border-cyan-400/20 ${spaceship.isActive ? 'animate-pulse' : 'opacity-0'
                    }`} style={{
                        animationDuration: '3s',
                    }}></div>

                <div className={`absolute -inset-3 rounded-full border border-blue-500/15 ${spaceship.isActive ? 'animate-pulse' : 'opacity-0'
                    }`} style={{
                        animationDelay: '0.5s',
                        animationDuration: '3.5s',
                    }}></div>

            </div>

            {/* Entry Portal Effect */}
            {spaceship.isActive && spaceship.progress < 0.1 && (
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-20"
                    style={{
                        transform: `translate(${spaceship.entryPortalX - 50}%, ${spaceship.entryPortalY - 50}%)`,
                    }}
                >
                    <div className="absolute top-1/2 left-1/2">
                        {/* Entry Stargate Ring */}
                        <div
                            className={`absolute top-1/2 left-1/2 rounded-full border-2 transform-gpu animate-motionBlur opacity-70`}
                            style={{
                                width: '120px',
                                height: '120px',
                                marginTop: '-60px',
                                marginLeft: '-60px',
                                borderColor: isDark ? '#60a5fa' : '#3b82f6',
                                boxShadow: isDark
                                    ? '0 0 40px rgba(96, 165, 250, 0.9), inset 0 0 20px rgba(96, 165, 250, 0.3)'
                                    : '0 0 40px rgba(59, 130, 246, 0.9), inset 0 0 20px rgba(59, 130, 246, 0.3)',
                                animation: 'portalPulse 2s ease-in-out infinite',
                            }}
                        />

                        {/* Entry Energy Field */}
                        <div
                            className="absolute top-1/2 left-1/2 rounded-full animate-energyBurst"
                            style={{
                                width: '80px',
                                height: '80px',
                                marginTop: '-40px',
                                marginLeft: '-40px',
                                background: `radial-gradient(circle, transparent 20%, ${isDark ? 'rgba(96,165,250,0.4)' : 'rgba(59,130,246,0.4)'} 50%, transparent 80%)`,
                                filter: 'blur(2px)',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Exit Portal Effect */}
            {spaceship.isActive && spaceship.progress > 0.9 && (
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-20"
                    style={{
                        transform: `translate(${spaceship.exitPortalX - 50}%, ${spaceship.exitPortalY - 50}%)`,
                    }}
                >
                    <div className="absolute top-1/2 left-1/2">
                        {/* Exit Stargate Ring */}
                        <div
                            className={`absolute top-1/2 left-1/2 rounded-full border-2 transform-gpu animate-motionBlur opacity-80 scale-150`}
                            style={{
                                width: '140px',
                                height: '140px',
                                marginTop: '-70px',
                                marginLeft: '-70px',
                                borderColor: isDark ? '#f97316' : '#ea580c',
                                boxShadow: isDark
                                    ? '0 0 50px rgba(249, 115, 22, 1), inset 0 0 30px rgba(249, 115, 22, 0.5)'
                                    : '0 0 50px rgba(234, 88, 12, 1), inset 0 0 30px rgba(234, 88, 12, 0.5)',
                                animation: 'portalPulse 1.5s ease-in-out infinite',
                            }}
                        />

                        {/* Exit Energy Field */}
                        <div
                            className="absolute top-1/2 left-1/2 rounded-full animate-energyBurst"
                            style={{
                                width: '100px',
                                height: '100px',
                                marginTop: '-50px',
                                marginLeft: '-50px',
                                background: `radial-gradient(circle, transparent 15%, ${isDark ? 'rgba(249,115,22,0.5)' : 'rgba(234,88,12,0.5)'} 60%, transparent 85%)`,
                                filter: 'blur(3px)',
                                animationDelay: '0.5s',
                            }}
                        />

                        {/* Exit Rays */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-energyBurst"
                                style={{
                                    left: `${20 + i * 10}%`,
                                    top: `${20 + (i % 4) * 15}%`,
                                    width: `${8 + i * 2}px`,
                                    height: `${8 + i * 2}px`,
                                    background: `linear-gradient(45deg, transparent, ${isDark ? 'rgba(249,115,22,0.9)' : 'rgba(234,88,12,0.9)'}, transparent)`,
                                    borderRadius: '50%',
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: '2s',
                                    transformOrigin: 'center',
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackgroundAnimation;