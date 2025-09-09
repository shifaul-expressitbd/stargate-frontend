import { selectIsLoggedIn } from '@/lib/features/auth/authSlice';
import { useAppSelector } from '@/lib/hooks';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
    requireRole?: string | string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectTo = '/login',
    requireRole,
}) => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const user = useAppSelector(state => state.auth.user);
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

    // Note: Business requirement logic removed per user request

    return <>{children}</>;
};