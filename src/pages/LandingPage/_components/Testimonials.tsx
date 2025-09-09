import { FaQuoteLeft } from 'react-icons/fa';
import { Heading } from '../../../components/shared/typography/heading';
import { Paragraph } from '../../../components/shared/typography/paragraph';
import ExtraterrestrialCard from './ExtraterrestrialCard';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Product Manager',
            avatar: 'https://avatar.iran.liara.run/public/girl',
            testimonial: 'Stargate transformed our workflow completely. The intuitive interface and powerful features helped our team increase productivity by 40%. Highly recommended!',
            glowColor: '#6366f1'
        },
        {
            name: 'Mike Chen',
            role: 'CTO',
            avatar: 'https://avatar.iran.liara.run/public/boy',
            testimonial: 'The scalability and security features of Stargate are exactly what we needed for our growing enterprise. The customer support is exceptional and responsive.',
            glowColor: '#ef4444'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Designer',
            avatar: 'https://avatar.iran.liara.run/public/girl',
            testimonial: 'As a designer, I love how user-friendly and visually appealing Stargate is. It seamlessly integrates with our design workflow while maintaining high performance.',
            glowColor: '#22c55e'
        }
    ];

    return (
        <section className="py-16 px-4 relative bg-black/60">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-40 right-32 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-500/20 rounded-full blur-lg"></div>
            </div>
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <Heading
                        as="h2"
                        variant="h2"
                        className="mb-4 text-white animate-hologram font-orbitron text-shadow-white-strong tracking-[0.15em] uppercase"
                    >
                        What Our Users Say
                    </Heading>
                    <Paragraph
                        size="lg"
                        className="max-w-2xl mx-auto text-purple-200 font-poppins text-shadow-purple-glow"
                    >
                        Don't just take our word for it. Here's what dimension explorers think about Stargate.
                    </Paragraph>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                    {testimonials.map((testimonial, index) => (
                        <ExtraterrestrialCard
                            key={index}
                            variant="testimonial"
                            glowColor={testimonial.glowColor}
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full mr-4 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/30"
                                />
                                <div>
                                    <div className="font-semibold text-cyan-300 text-sm font-poppins">{testimonial.name}</div>
                                    <div className="text-xs text-purple-200/80">{testimonial.role}</div>
                                </div>
                            </div>
                            <div className="relative">
                                <FaQuoteLeft className="absolute top-0 left-0 text-cyan-400/60 text-sm" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
                                <p className="text-purple-200 leading-relaxed pl-6 italic font-poppins">
                                    "{testimonial.testimonial}"
                                </p>
                            </div>
                        </ExtraterrestrialCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;