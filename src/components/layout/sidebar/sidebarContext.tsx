import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';

export interface SidebarContextType {
    isSidebarOpen: boolean;
    isCollapsed: boolean;
    currentMode: string;
    isDesktop: boolean;
    isTablet: boolean;
    isLaptop: boolean;
    isMobile: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    toggleCollapse: () => void;
    openMenus: string[];
    toggleMenu: (title: string) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    return context;
};

export const SidebarProvider: React.FC<{
    value: SidebarContextType;
    children: ReactNode
}> = ({ value, children }) => {
    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};