import { useContext } from 'react';
import type { ResponsiveValues } from '../providers/ResponsiveContext';
import { ResponsiveContext } from '../providers/ResponsiveContext';

export const useResponsive = (): ResponsiveValues => {
    const context = useContext(ResponsiveContext);
    if (!context) {
        throw new Error('useResponsive must be used within ResponsiveProvider');
    }
    return context;
};