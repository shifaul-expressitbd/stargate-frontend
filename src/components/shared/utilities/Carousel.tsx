import { AnimatePresence, motion } from 'motion/react';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CarouselItem {
    id: string;
    title?: string;
    content: React.ReactNode;
}

interface CarouselProps {
    items: CarouselItem[];
    className?: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    onIndexChange?: (index: number) => void;
}

export interface CarouselRef {
    nextSlide: () => void;
    prevSlide: () => void;
}

export const Carousel = forwardRef<CarouselRef, CarouselProps>(({
    items,
    className = '',
    autoPlay = false,
    autoPlayInterval = 5000,
    onIndexChange
}, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    useImperativeHandle(ref, () => ({
        nextSlide,
        prevSlide
    }));

    const goToSlide = useCallback((index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex]);

    useEffect(() => {
        onIndexChange?.(currentIndex);
    }, [currentIndex, onIndexChange]);

    React.useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(timer);
    }, [autoPlay, autoPlayInterval, nextSlide]);

    if (items.length === 0) return null;

    return (
        <div className={`relative ${className}`}>
            {/* Content */}
            <div className="relative overflow-hidden rounded-lg border p-4 min-h-[200px]">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 400, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 },
                        }}
                        className="absolute inset-0 p-2"
                    >
                        {items[currentIndex].content}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center my-1 space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex
                            ? 'bg-primary'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation buttons */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white shadow-md transition-colors"
                        aria-label="Previous slide"
                    >
                        <FaChevronLeft className="w-3 h-3 text-gray-200" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white shadow-md transition-colors"
                        aria-label="Next slide"
                    >
                        <FaChevronRight className="w-3 h-3 text-gray-200" />
                    </button>
                </>
            )}
        </div>
    );
});

export default Carousel;