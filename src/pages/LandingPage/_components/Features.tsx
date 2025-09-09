import { FaBolt, FaExpand, FaHeart, FaShieldAlt } from 'react-icons/fa';
import { Icon } from '../../../components/shared/icons/icon';
import { Heading } from '../../../components/shared/typography/heading';
import { Paragraph } from '../../../components/shared/typography/paragraph';
import ExtraterrestrialCard from './ExtraterrestrialCard';

const Features = () => {
    const features = [
        {
            icon: FaShieldAlt,
            title: 'Interdimensional Security',
            description: 'Unbreakable security protocols that protect your data across all dimensions and reality layers.',
            glowColor: '#06b6d4'
        },
        {
            icon: FaBolt,
            title: 'Instant Portal Travel',
            description: 'Sub-second interdimensional navigation with instant connectivity and real-time synchronization.',
            glowColor: '#f59e0b'
        },
        {
            icon: FaExpand,
            title: 'Infinite Scalability',
            description: 'Scale across infinite universes with our dimensionally-aware cloud architecture.',
            glowColor: '#ec4899'
        },
        {
            icon: FaHeart,
            title: 'Intuitive Navigation',
            description: 'Natural portal controls designed for seamless travel through complex dimensional networks.',
            glowColor: '#10b981'
        }
    ];

    return (
        <section className="py-16 px-4 bg-black/60">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <Heading
                        as="h2"
                        variant="h2"
                        className="mb-4 text-white animate-hologram font-orbitron text-shadow-white-strong tracking-[0.15em] uppercase"
                    >
                        Why Journey Through Stargate?
                    </Heading>
                    <Paragraph
                        size="lg"
                        className="max-w-2xl mx-auto text-purple-200 font-poppins text-shadow-purple-glow"
                    >
                        Discover the features that make our platform the preferred choice for teams worldwide.
                    </Paragraph>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <ExtraterrestrialCard
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            icon={<Icon
                                icon={feature.icon}
                                size={32}
                                color="currentColor"
                            />}
                            variant="feature"
                            glowColor={feature.glowColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;