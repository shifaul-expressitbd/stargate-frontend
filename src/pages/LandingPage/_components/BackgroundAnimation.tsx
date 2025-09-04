import { useEffect, useRef, useState } from "react";

interface Star {
    id: number;
    x: number;
    y: number;
    delay: number;
    size: number;
}

interface SpiralPattern {
    centerX: number;
    centerY: number;
    initialRadius: number;
    spiralRate: number;
    inwardsSpeed: number;
}

interface ZigzagPattern {
    amplitude: number;
    frequency: number;
    startX: number;
    endX: number;
    startY: number;
}

interface OrbitalPattern {
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    orbitalSpeed: number;
}

interface LoopPattern {
    centerX: number;
    centerY: number;
    radius: number;
    loopSpeed: number;
}

interface DivePattern {
    startHeight: number;
    diveDepth: number;
    width: number;
    diveSpeed: number;
}

interface DriftPoint {
    x: number;
    y: number;
}

interface DriftPattern {
    numPoints: number;
    points: DriftPoint[];
    driftSpeed: number;
}

type PatternParams = SpiralPattern | ZigzagPattern | OrbitalPattern | LoopPattern | DivePattern | DriftPattern;

interface SpaceshipState {
    x: number;
    y: number;
    rotation: number;
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    isActive: boolean;
    patternType: string;
    patternParams: PatternParams;
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
    const [trajectory, setTrajectory] = useState<Array<{ x: number; y: number; opacity: number; id: number }>>([]);
    const [futureTrajectory, setFutureTrajectory] = useState<Array<{ x: number; y: number }>>([]);
    const [spaceship, setSpaceship] = useState<SpaceshipState>({
        x: 50,
        y: 50,
        rotation: -15,
        velocity: { x: 0.8, y: -0.4 },
        acceleration: { x: 0, y: 0 },
        isActive: true,
        patternType: 'spiral',
        patternParams: {
            centerX: 50,
            centerY: 50,
            initialRadius: 30,
            spiralRate: 1,
            inwardsSpeed: 1
        },
        progress: 0,
        totalTime: 8,
        portalX: 50,
        portalY: 50,
        entryPortalX: 50,
        entryPortalY: 50,
        exitPortalX: 50,
        exitPortalY: 50,
    });
    const animationFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Generate procedural trajectory patterns
    const generatePattern = (): { patternType: string; params: PatternParams; startX: number; startY: number } => {
        const patterns = ['spiral', 'zigzag', 'orbital', 'loop', 'dive', 'drift'];
        const patternType = patterns[Math.floor(Math.random() * patterns.length)];

        const startX = Math.random() * 100 - 10; // Start slightly off-screen
        const startY = Math.random() * 100 - 10;

        let params: PatternParams;

        switch (patternType) {
            case 'spiral': {
                params = {
                    centerX: Math.random() * 100,
                    centerY: Math.random() * 100,
                    initialRadius: Math.random() * 20 + 30,
                    spiralRate: Math.random() * 2 + 1,
                    inwardsSpeed: Math.random() * 2 + 1
                };
                break;
            }
            case 'zigzag': {
                params = {
                    amplitude: Math.random() * 30 + 10,
                    frequency: Math.random() * 4 + 2,
                    startX: startX,
                    startY: startY,
                    endX: Math.random() * 100 + 20
                };
                break;
            }
            case 'orbital': {
                params = {
                    centerX: Math.random() * 100,
                    centerY: Math.random() * 100,
                    radiusX: Math.random() * 40 + 20,
                    radiusY: Math.random() * 40 + 20,
                    orbitalSpeed: Math.random() * 4 + 2
                };
                break;
            }
            case 'loop': {
                params = {
                    centerX: Math.random() * 100,
                    centerY: Math.random() * 100,
                    radius: Math.random() * 25 + 15,
                    loopSpeed: Math.random() * 3 + 1
                };
                break;
            }
            case 'dive': {
                params = {
                    startHeight: startY,
                    diveDepth: Math.random() * 80 + 20,
                    width: Math.random() * 80 + 40,
                    diveSpeed: Math.random() * 2 + 1
                };
                break;
            }
            case 'drift': {
                params = {
                    numPoints: Math.floor(Math.random() * 3) + 4,
                    points: [],
                    driftSpeed: Math.random() * 2 + 1
                };
                // Build points array
                const driftParams = params as DriftPattern;
                for (let i = 0; i < driftParams.numPoints; i++) {
                    driftParams.points.push({ x: Math.random() * 100, y: Math.random() * 100 });
                }
                break;
            }
            default: {
                // Fallback - should never reach here
                params = {
                    centerX: 50,
                    centerY: 50,
                    initialRadius: 30,
                    spiralRate: 1,
                    inwardsSpeed: 1
                };
            }
        }

        return { patternType, params, startX, startY };
    };

    // Calculate perspective scaling based on distance to center/portal
    const calculatePerspectiveScale = (shipX: number, shipY: number, centerX: number, centerY: number) => {
        // Calculate Euclidean distance from spaceship to center/portal
        const dx = shipX - centerX;
        const dy = shipY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Perspective scaling formula: smaller when farther away
        // scale = maxScale - (distance * scaleFactor)
        // Clamp between min and max scale values
        const maxScale = 1.2;      // Maximum scale when very close to center
        const minScale = 0.5;      // Minimum scale when very far from center
        const scaleFactor = 0.15;  // How quickly scale decreases with distance

        // Calculate scale and clamp to valid range
        const scale = maxScale - (distance * scaleFactor);
        return Math.max(minScale, Math.min(maxScale, scale));
    };

    // Calculate position for pattern at given progress (0-1)
    const getPatternPosition = (patternType: string, params: PatternParams, progress: number) => {
        switch (patternType) {
            case 'spiral': {
                const spiralParams = params as SpiralPattern;
                const angle = progress * 4 * Math.PI * spiralParams.spiralRate;
                const radius = spiralParams.initialRadius - progress * spiralParams.initialRadius;
                return {
                    x: spiralParams.centerX + Math.cos(angle) * radius,
                    y: spiralParams.centerY + Math.sin(angle) * radius,
                };
            }
            case 'zigzag': {
                const zigzagParams = params as ZigzagPattern;
                const x = zigzagParams.startX + progress * (zigzagParams.endX - zigzagParams.startX);
                const y = zigzagParams.startY + Math.sin(progress * zigzagParams.frequency * Math.PI) * zigzagParams.amplitude;
                return { x, y };
            }
            case 'orbital': {
                const orbitalParams = params as OrbitalPattern;
                const orbitalAngle = progress * 2 * Math.PI * orbitalParams.orbitalSpeed;
                return {
                    x: orbitalParams.centerX + Math.cos(orbitalAngle) * orbitalParams.radiusX,
                    y: orbitalParams.centerY + Math.sin(orbitalAngle) * orbitalParams.radiusY,
                };
            }
            case 'loop': {
                const loopParams = params as LoopPattern;
                const loopAngle = progress * 4 * Math.PI * loopParams.loopSpeed;
                return {
                    x: loopParams.centerX + Math.cos(loopAngle) * loopParams.radius,
                    y: loopParams.centerY + Math.sin(loopAngle) * loopParams.radius,
                };
            }
            case 'dive': {
                const diveParams = params as DivePattern;
                const diveProgress = 1 - Math.pow(1 - progress, 2);
                const widthOffset = Math.sin(progress * Math.PI * diveParams.diveSpeed) * diveParams.width / 2;
                return {
                    x: 50 + widthOffset,
                    y: diveParams.startHeight + diveProgress * (diveParams.startHeight - diveParams.diveDepth),
                };
            }
            case 'drift': {
                const driftParams = params as DriftPattern;
                const segment = Math.floor(progress * (driftParams.points.length - 1));
                const segmentProgress = (progress * (driftParams.points.length - 1)) % 1;
                const startPoint = driftParams.points[segment];
                const endPoint = driftParams.points[Math.min(segment + 1, driftParams.points.length - 1)];
                return {
                    x: startPoint.x + segmentProgress * (endPoint.x - startPoint.x),
                    y: startPoint.y + segmentProgress * (endPoint.y - startPoint.y),
                };
            }
            default:
                return { x: 50, y: 50 };
        }
    };

    // Physics simulation with gravity
    const applyPhysics = (state: SpaceshipState, targetX: number, targetY: number, deltaTime: number) => {
        const dx = targetX - state.x;
        const dy = targetY - state.y;

        // Attract to gravity center
        const gravityCenter = { x: 50, y: 50 };
        const gravityForce = { x: (gravityCenter.x - state.x) * 0.0001, y: (gravityCenter.y - state.y) * 0.0001 };

        // Update acceleration towards target with physics
        const acceleration = 0.2;
        const maxForce = 0.02;
        const forceX = Math.max(-maxForce, Math.min(maxForce, dx * acceleration));
        const forceY = Math.max(-maxForce, Math.min(maxForce, dy * acceleration));

        state.acceleration.x = forceX + gravityForce.x;
        state.acceleration.y = forceY + gravityForce.y;

        // Update velocity
        state.velocity.x += state.acceleration.x * deltaTime * 25;
        state.velocity.y += state.acceleration.y * deltaTime * 25;

        // Adaptive dampening (deceleration)
        const maxSpeed = 1.5;
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
        state.x += state.velocity.x * deltaTime * 25;
        state.y += state.velocity.y * deltaTime * 25;

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

    // Trajectory fade-out effect
    useEffect(() => {
        const fadeInterval = setInterval(() => {
            setTrajectory(prevTrajectory => {
                return prevTrajectory
                    .map(point => ({
                        ...point,
                        opacity: Math.max(0, point.opacity - 0.1)
                    }))
                    .filter(point => point.opacity > 0.05); // Remove fully faded points
            });
        }, 100); // Fade every 100ms

        return () => clearInterval(fadeInterval);
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

            // Clear trajectory for new pattern
            setTrajectory([]);

            // Clear future trajectory - will be calculated in animation loop
            setFutureTrajectory([]);
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

                    // Add current position to trajectory with fade-out effect
                    setTrajectory(prevTrajectory => {
                        let currentId = 0;
                        if (prevTrajectory.length > 0) {
                            currentId = Math.max(...prevTrajectory.map(p => p.id)) + 1;
                        }
                        const newPoint = { x: newState.x, y: newState.y, opacity: 1.0, id: currentId };
                        const updatedTrajectory = [...prevTrajectory, newPoint];
                        // Keep only the last 50 points to avoid performance issues
                        return updatedTrajectory.length > 50 ? updatedTrajectory.slice(-50) : updatedTrajectory;
                    });

                    // Calculate future trajectory points ahead of spaceship
                    setFutureTrajectory(() => {
                        const futurePoints = [];
                        const segments = 20; // Number of points ahead
                        const remainingProgress = 1.0 - newState.progress;
                        const segmentLength = remainingProgress / segments;

                        if (remainingProgress > 0.01) { // Only show if there's significant progress left
                            futurePoints.push({
                                x: newState.x,
                                y: newState.y
                            });

                            for (let i = 1; i <= segments; i++) {
                                const futureProgress = newState.progress + (segmentLength * i);
                                const clampedProgress = Math.min(futureProgress, 0.99);
                                const futurePos = getPatternPosition(newState.patternType, newState.patternParams, clampedProgress);
                                futurePoints.push({
                                    x: futurePos.x,
                                    y: futurePos.y
                                });
                            }
                        }

                        return futurePoints;
                    });
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
            {particles.map((particle) => (
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

            {/* Trajectory Line */}
            {trajectory.length > 1 && (
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 5 }}
                >
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {trajectory.map((point, index) => {
                        if (index === 0) return null;
                        const prevPoint = trajectory[index - 1];
                        return (
                            <line
                                key={point.id}
                                x1={`${prevPoint.x}%`}
                                y1={`${prevPoint.y}%`}
                                x2={`${point.x}%`}
                                y2={`${point.y}%`}
                                stroke={isDark ? '#6b7280' : '#9ca3af'}
                                strokeWidth="2"
                                opacity={point.opacity}
                                strokeLinecap="round"
                                filter="url(#glow)"
                            />
                        );
                    })}
                    {/* Future Trajectory Path */}
                    {futureTrajectory.length > 1 && (
                        <path
                            d={`M ${futureTrajectory.map(point => `${point.x} ${point.y}`).join(' L ')}`}
                            stroke="#ff0000"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="8,4"
                            opacity="0.8"
                        />
                    )}
                </svg>
            )}

            {/* Star Trek USS Enterprise (1701-E) */}
            <div
                className={`absolute opacity-90 animate-spaceship transform-gpu ${spaceship.isActive ? 'animate-motionBlur' : 'opacity-0'}`}
                style={{
                    left: `${spaceship.x}%`,
                    top: `${spaceship.y}%`,
                    transform: `translate(-50%, -50%) ${spaceship.isActive ? `scale(${calculatePerspectiveScale(spaceship.x, spaceship.y, 50, 50)})` : 'scale(0.8)'} rotate(${spaceship.rotation}deg)`,
                    transition: spaceship.isActive ? 'transform 0.1s linear' : 'none',
                }}
            >
                <div className="relative transform-gpu" style={{
                    transform: 'translate(-50%, -50%)',
                    transformOrigin: 'center center',
                }}>

                    {/* SAUCER SECTION (Primary Hull) */}
                    <div className={`relative transform-gpu ${isDark ? 'bg-gradient-radial from-slate-600 to-slate-800' : 'bg-gradient-radial from-slate-800 to-slate-900'}`}>
                        {/* Main Saucer Disc */}
                        <div className="w-32 h-16 border border-gray-600 rounded-t-full"></div>

                        {/* Bridge Tower */}
                        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-6 rounded-full border ${isDark ? 'bg-slate-700 border-gray-500' : 'bg-slate-800 border-gray-600'}`}>
                            <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-sm bg-black border">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full absolute top-0.5 left-0.5 opacity-80 animate-pulse"></div>
                            </div>
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1 bg-blue-400 rounded-sm opacity-70"></div>
                        </div>

                        {/* Deflector Dish */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-3 border-2 border-gray-500 rounded-full bg-gradient-to-br from-gray-400 to-gray-600">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full absolute top-0.5 left-0.5 opacity-90 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Saucer Windows/Details */}
                        <div className="absolute top-2 left-4 w-1 h-1 bg-cyan-400 rounded-full opacity-70"></div>
                        <div className="absolute top-2 left-6 w-1 h-1 bg-cyan-400 rounded-full opacity-70"></div>
                        <div className="absolute top-2 left-20 w-1 h-1 bg-cyan-400 rounded-full opacity-70"></div>
                        <div className="absolute top-2 left-24 w-1 h-1 bg-cyan-400 rounded-full opacity-70"></div>
                        <div className="absolute top-4 left-8 w-1.5 h-0.5 bg-cyan-400 rounded-full opacity-60"></div>
                        <div className="absolute top-4 left-16 w-1.5 h-0.5 bg-cyan-400 rounded-full opacity-60"></div>
                    </div>

                    {/* SECONDARY HULL / ENGINEERING SECTION */}
                    <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 ${isDark ? 'bg-gradient-to-r from-slate-700 to-slate-800' : 'bg-gradient-to-r from-slate-800 to-slate-900'} w-8 h-6 border border-gray-600 rounded-b-md`}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full absolute top-1 left-1 animate-pulse"></div>
                        <div className="w-1 h-1 bg-red-500 rounded-full absolute top-1 right-1 animate-pulse"></div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-80"></div>
                    </div>

                    {/* WARP NACELLE PYLONS */}
                    {/* Left Pylon */}
                    <div className={`absolute top-14 -left-8 ${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-slate-700 to-slate-800'} w-8 h-2 border border-gray-600 transform rotate-12`}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full absolute top-0.5 right-0 animate-pulse"></div>
                    </div>
                    {/* Right Pylon */}
                    <div className={`absolute top-14 left-24 ${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-slate-700 to-slate-800'} w-8 h-2 border border-gray-600 transform -rotate-12`}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full absolute top-0.5 left-0 animate-pulse"></div>
                    </div>

                    {/* WARP NACELLES */}
                    {/* Left Nacelle */}
                    <div className={`absolute top-10 -left-16 ${isDark ? 'bg-gradient-radial from-blue-600 to-blue-900' : 'bg-gradient-radial from-blue-500 to-blue-800'} w-12 h-3 border border-gray-600 rounded-full`}>
                        <div className="w-10 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full absolute top-0.75 left-0.75 opacity-90 blur-sm"></div>
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full absolute top-1 left-1.5 opacity-80 blur-sm"></div>
                    </div>
                    {/* Right Nacelle */}
                    <div className={`absolute top-10 left-20 ${isDark ? 'bg-gradient-radial from-blue-600 to-blue-900' : 'bg-gradient-radial from-blue-500 to-blue-800'} w-12 h-3 border border-gray-600 rounded-full`}>
                        <div className="w-10 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full absolute top-0.75 left-0.75 opacity-90 blur-sm"></div>
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full absolute top-1 left-1.5 opacity-80 blur-sm"></div>
                    </div>

                    {/* WARP FIELD EFFECTS */}
                    <div className={`absolute top-8 -left-18 w-16 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent opacity-60 blur-sm rounded-full ${spaceship.isActive ? 'animate-pulse' : ''}`}></div>
                    <div className={`absolute top-8 left-14 w-16 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent opacity-60 blur-sm rounded-full ${spaceship.isActive ? 'animate-pulse' : ''}`}></div>
                    <div className={`absolute top-9 -left-18 w-14 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-transparent opacity-50 blur-sm rounded-full ${spaceship.isActive ? 'animate-pulse' : ''} ${spaceship.isActive ? 'animate-floatParticle' : ''}`} style={{ animationDelay: '0.2s' }}></div>
                    <div className={`absolute top-9 left-16 w-14 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-transparent opacity-50 blur-sm rounded-full ${spaceship.isActive ? 'animate-pulse' : ''} ${spaceship.isActive ? 'animate-floatParticle' : ''}`} style={{ animationDelay: '0.2s' }}></div>

                </div>

                {/* Warp Drive Bubble/Field */}
                <div className={`absolute -left-6 -top-4 rounded-full border-2 border-cyan-400/30 ${spaceship.isActive ? 'animate-pulse' : 'opacity-0'}`} style={{
                    width: '44px',
                    height: '28px',
                    animationDuration: '2s',
                }}></div>

                <div className={`absolute -inset-2 rounded-full border border-blue-500/20 ${spaceship.isActive ? 'animate-pulse' : 'opacity-0'}`} style={{
                    animationDelay: '0.5s',
                    animationDuration: '2.5s',
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
                                borderColor: isDark ? '#8b5cf6' : '#7c3aed',
                                boxShadow: isDark
                                    ? '0 0 40px rgba(139, 92, 246, 0.9), inset 0 0 20px rgba(139, 92, 246, 0.3)'
                                    : '0 0 40px rgba(124, 58, 237, 0.9), inset 0 0 20px rgba(124, 58, 237, 0.3)',
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
                                background: `radial-gradient(circle, transparent 20%, ${isDark ? 'rgba(139,92,246,0.4)' : 'rgba(124,58,237,0.4)'} 50%, transparent 80%)`,
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
                                borderColor: isDark ? '#fb923c' : '#f59e0b',
                                boxShadow: isDark
                                    ? '0 0 50px rgba(251, 146, 60, 1), inset 0 0 30px rgba(251, 146, 60, 0.5)'
                                    : '0 0 50px rgba(245, 158, 11, 1), inset 0 0 30px rgba(245, 158, 11, 0.5)',
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
                                background: `radial-gradient(circle, transparent 15%, ${isDark ? 'rgba(251,146,60,0.5)' : 'rgba(245,158,11,0.5)'} 60%, transparent 85%)`,
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
                                    background: `linear-gradient(45deg, transparent, ${isDark ? 'rgba(234,88,12,0.9)' : 'rgba(220,38,38,0.9)'}, transparent)`,
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