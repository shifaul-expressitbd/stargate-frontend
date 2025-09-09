import type { ReactNode } from "react";

interface ExtraterrestrialCardProps {
    title?: string;
    description?: string;
    icon?: ReactNode;
    variant?: 'feature' | 'testimonial' | 'process';
    glowColor?: string;
    children?: ReactNode;
}

const ExtraterrestrialCard = ({
    title,
    description,
    icon,
    variant = 'feature',
    glowColor = '#8b5cf6',
    children
}: ExtraterrestrialCardProps) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'feature':
                return {
                    base: 'relative group min-h-[400px] flex flex-col',
                    content: 'p-6 text-center flex flex-col flex-1',
                    titleClass: 'text-xl font-bold mb-4 text-cyan-300 flex-shrink-0 font-orbitron',
                    descClass: 'text-purple-200 leading-relaxed flex-1 font-poppins',
                    containerExtra: 'flex flex-col'
                };
            case 'testimonial':
                return {
                    base: 'relative group min-h-[320px] flex flex-col',
                    content: 'p-6 flex flex-col flex-1',
                    titleClass: 'text-lg font-semibold mb-3 text-cyan-300 flex-shrink-0 font-orbitron',
                    descClass: 'text-purple-200 italic flex-1 font-poppins',
                    containerExtra: 'flex flex-col'
                };
            case 'process':
                return {
                    base: 'relative group min-h-[280px] flex flex-col text-center',
                    content: 'p-6 flex flex-col flex-1',
                    titleClass: 'text-xl font-bold mb-3 text-cyan-300 font-orbitron',
                    descClass: 'text-purple-200 flex-1 font-poppins',
                    containerExtra: 'flex flex-col'
                };
            default:
                return {
                    base: 'relative group min-h-[400px] flex flex-col',
                    content: 'p-6 text-center flex flex-col flex-1',
                    titleClass: 'text-xl font-bold mb-4 text-cyan-300 flex-shrink-0 font-orbitron',
                    descClass: 'text-purple-200 leading-relaxed flex-1 font-poppins',
                    containerExtra: 'flex flex-col'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className={styles.base}>
            {/* Alien Glow Border */}
            <div
                className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-100 transition-all duration-700"
                style={{
                    background: `linear-gradient(135deg, ${glowColor}20, #000000, ${glowColor}30)`,
                    boxShadow: `0 0 30px ${glowColor}30, inset 0 0 20px ${glowColor}10`,
                }}
            />

            {/* Outer Glow Effect */}
            <div
                className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                    background: `radial-gradient(circle at center, ${glowColor}40, transparent 70%)`,
                    filter: 'blur(8px)',
                }}
            />

            {/* Inner Glow Ring */}
            <div
                className="absolute inset-2 rounded-lg"
                style={{
                    background: `linear-gradient(135deg, transparent, ${glowColor}15, transparent, ${glowColor}10, transparent)`,
                    animation: 'rotate 20s linear infinite',
                }}
            />

            {/* Energy Lines */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 w-1 h-full opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{
                        background: `linear-gradient(to bottom, transparent, ${glowColor}, transparent)`,
                        animation: 'pulse 3s ease-in-out infinite',
                        transform: 'translateX(-50%)',
                    }}
                />
                <div
                    className="absolute top-1/2 left-0 w-full h-1 opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{
                        background: `linear-gradient(to right, transparent, ${glowColor}, transparent)`,
                        animation: 'pulse 4s ease-in-out infinite',
                        transform: 'translateY(-50%)',
                    }}
                />
            </div>

            {/* Content */}
            <div className={`relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl ${styles.content}`}>
                {/* Alien Symbol - Different positions for different variants */}
                <div className={`absolute w-3 h-3 ${variant === 'feature' ? 'top-2 right-2' : variant === 'testimonial' ? 'top-2 left-2' : 'top-2 right-2'}`}>
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: `radial-gradient(circle, ${glowColor}80, transparent)`,
                            boxShadow: `0 0 10px ${glowColor}60`,
                        }}
                    />
                </div>

                {/* Variant-specific top indicator */}
                {variant === 'process' && (
                    <div className="mb-3">
                        <div className="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{
                                background: `linear-gradient(135deg, ${glowColor}60, ${glowColor}20)`,
                                border: `2px solid ${glowColor}40`,
                                color: '#ffffff',
                                fontFamily: '"Orbitron", monospace'
                            }}>
                            ✓
                        </div>
                    </div>
                )}

                {/* Icon Container - Different positioning for variants */}
                {icon && (
                    <div className={`flex justify-center ${variant === 'testimonial' ? 'mb-2' : 'mb-4'} flex-shrink-0`}>
                        <div
                            className={`rounded-full flex items-center justify-center backdrop-blur-sm border group-hover:border-white/40 transition-all duration-500 ${variant === 'feature' ? 'w-16 h-16 border-white/20' : variant === 'testimonial' ? 'w-12 h-12 border-white/30' : 'w-14 h-14 border-white/25'}`}
                            style={{
                                background: `radial-gradient(circle, ${glowColor}20, transparent)`,
                                boxShadow: `0 0 20px ${glowColor}30`,
                            }}
                        >
                            <div className={`${variant === 'feature' ? 'text-blue-400' : variant === 'testimonial' ? 'text-cyan-300' : 'text-purple-400'} group-hover:text-cyan-300 transition-colors duration-300`}
                                style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}>
                                {icon}
                            </div>
                        </div>
                    </div>
                )}

                {/* Title */}
                <h3 className={`${styles.titleClass} ${variant === 'testimonial' ? '' : ''}`}>
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className={`${styles.descClass} flex-shrink-0`}>
                        {description}
                    </p>
                )}

                {/* Custom Children */}
                {children && (
                    <div className={`mt-3 flex-1 ${variant === 'testimonial' ? '' : ''}`}>
                        {children}
                    </div>
                )}

                {/* Holographic Effect */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
                        animation: 'shimmer 2s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Energy Particles */}
            <div className="absolute -inset-4 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: glowColor,
                            left: `${20 + i * 10}%`,
                            top: `${10 + (i % 3) * 30}%`,
                            animation: `floatParticle 3s ease-in-out infinite ${i * 0.2}s`,
                            boxShadow: `0 0 6px ${glowColor}`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExtraterrestrialCard;