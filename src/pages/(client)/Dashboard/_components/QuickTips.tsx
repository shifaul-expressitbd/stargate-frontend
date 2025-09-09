import Carousel, { type CarouselRef } from '@/components/shared/utilities/Carousel';
import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';

const QuickTips = () => {
    const carouselRef = useRef<CarouselRef>(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const quickTipsData = [
        {
            id: '1',
            title: 'Setup',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium tracking-wide uppercase text-cyan-400 font-poppins text-shadow-cyan-glow">Setup</span>

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

                    <h4 className="mb-2 font-medium text-white font-orbitron animate-hologram">Calibrate Your Gateway</h4>
                    <p className="text-cyan-200 text-sm leading-relaxed font-poppins">
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

                        <span className="text-xs font-medium tracking-wide uppercase text-purple-400 font-poppins text-shadow-purple-strong-glow">Analytics</span>

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

                    <h4 className="mb-2 font-medium text-white font-orbitron animate-hologram">Track Dimension Behavior</h4>
                    <p className="text-purple-200 text-sm leading-relaxed font-poppins">
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

                        <span className="text-xs font-medium tracking-wide uppercase text-red-400 font-poppins text-shadow-purple-glow">Security</span>

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

                    <h4 className="mb-2 font-medium text-white font-orbitron animate-hologram">Monitor Wormhole Compliance</h4>
                    <p className="text-red-200 text-sm leading-relaxed font-poppins">
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

                        <span className="text-xs font-medium tracking-wide uppercase text-blue-400 font-poppins text-shadow-blue-glow-strong">Performance</span>

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

                    <h4 className="mb-2 font-medium text-white font-orbitron animate-hologram">Optimize Portal Load Times</h4>
                    <p className="text-blue-200 text-sm leading-relaxed font-poppins">
                        Monitor your tracking scripts performance and optimize loading to improve interdimensional connectivity without sacrificing analysis quality.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="bg-transparent backdrop-blur-md shadow-2xl rounded-xl border border-purple-400/30 p-6 relative overflow-hidden">

            <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-purple-500/20 p-2 border border-purple-400/40 flex items-center justify-center">
                    <MdOutlineTipsAndUpdates className="h-5 w-5 text-purple-400 " />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-white font-orbitron animate-hologram">Portal Operation Tips</h3>
                    <p className="text-purple-200 text-sm font-poppins">Interdimensional best practices</p>
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
    );
};

export default QuickTips;