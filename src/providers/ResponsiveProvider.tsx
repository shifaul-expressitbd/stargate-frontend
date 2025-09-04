import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    ResponsiveContext,
    type ResponsiveMode,
    type ResponsiveValues,
} from './ResponsiveContext';

// Export types and context for use in hooks

const mediaQueryOptions = { debounceMs: 200 }; // Increased debouncing

interface ResponsiveProviderProps {
    children: React.ReactNode;
}

export const ResponsiveProvider = ({ children }: ResponsiveProviderProps) => {
    // Centralized media queries - single source of truth
    const isMobile = useMediaQuery({ query: "(max-width: 767px)", ...mediaQueryOptions });
    const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1279px)", ...mediaQueryOptions });
    const isLaptop = useMediaQuery({ query: "(min-width: 1280px) and (max-width: 1919px)", ...mediaQueryOptions });
    const isDesktop = useMediaQuery({ query: "(min-width: 1920px)", ...mediaQueryOptions });

    const currentMode = useMemo<ResponsiveMode>(() => {
        if (isMobile) return 'mobile';
        if (isTablet) return 'tablet';
        if (isLaptop) return 'laptop';
        return 'desktop';
    }, [isMobile, isTablet, isLaptop]);

    const values = useMemo<ResponsiveValues>(() => ({
        isMobile,
        isTablet,
        isLaptop,
        isDesktop,
        currentMode,
    }), [isMobile, isTablet, isLaptop, isDesktop, currentMode]);

    return (
        <ResponsiveContext.Provider value={values}>
            {children}
        </ResponsiveContext.Provider>
    );
};

export type { ResponsiveMode, ResponsiveValues } from './ResponsiveContext';

