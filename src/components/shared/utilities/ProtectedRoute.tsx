import { selectIsLoggedIn } from '@/lib/features/auth/authSlice';
import { useAppSelector } from '@/lib/hooks';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
    requireRole?: string | string[];
    requireBusiness?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectTo = '/login',
    requireRole,
    requireBusiness = false
}) => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const user = useAppSelector(state => state.auth.user);
    const hasBusiness = useAppSelector(state => state.auth.hasBusiness);
    const jwtPayload = useAppSelector(state => state.auth.jwtPayload);
    const location = useLocation();

    // Check if user is logged in
    if (!isLoggedIn || !user) {
        return <Navigate to={redirectTo} state={{ destination: location.pathname }} replace />;
    }

    // Check if specific role is required
    if (requireRole) {
        const userRoles = jwtPayload?.roles || [];
        const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            // Redirect to unauthorized page
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Check if business is required
    if (requireBusiness && !hasBusiness) {
        return <Navigate to="/onboarding" state={{ destination: location.pathname, message: 'Business required' }} replace />;
    }

    return <>{children}</>;
};