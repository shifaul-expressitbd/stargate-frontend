import { createContext } from 'react';

export type ResponsiveMode = 'mobile' | 'tablet' | 'laptop' | 'desktop';

export interface ResponsiveValues {
    isMobile: boolean;
    isTablet: boolean;
    isLaptop: boolean;
    isDesktop: boolean;
    currentMode: ResponsiveMode;
}

export const ResponsiveContext = createContext<ResponsiveValues | null>(null);