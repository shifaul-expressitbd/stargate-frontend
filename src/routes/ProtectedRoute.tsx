import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  logout,
  selectCurrentToken,
  selectCurrentUser
} from '../lib/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../lib/hooks'

type ProtectedRouteProps = {
  children: ReactNode
  roles?: string[] // Optional: if provided, user must have at least one matching role
  requireBusiness?: boolean // Optional: require user to have business
}

const ProtectedRoute = ({
  children,
  roles = [],
  requireBusiness = false
}: ProtectedRouteProps) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectCurrentToken)
  const user = useAppSelector(selectCurrentUser)
  const jwtPayload = useAppSelector((state) => state.auth.jwtPayload)
  const hasBusiness = useAppSelector((state) => state.auth.hasBusiness)
  const location = useLocation()

  const pathname = location.pathname + (location.search || '')
  const destination = pathname.startsWith('/admin') ? '/admin/dashboard' : pathname

  // Check if user is logged in
  if (!token || !user) {
    return <Navigate to='/login' state={{ destination }} replace />
  }

  // Check if role requirements are specified
  if (roles.length > 0) {
    const userRoles = jwtPayload?.roles || []

    // Check for role-based access
    const hasRequiredRole = roles.some(role => userRoles.includes(role))

    if (!hasRequiredRole) {
      // Access denied - redirect to unauthorized page or login
      dispatch(logout())
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Check if business is required
  if (requireBusiness && !hasBusiness) {
    return <Navigate
      to="/onboarding"
      state={{ destination, message: 'Business setup required' }}
      replace
    />
  }

  // Check token expiry (fallback)
  if (jwtPayload?.exp) {
    const expiryTime = jwtPayload.exp * 1000
    const now = Date.now()
    if (now > expiryTime) {
      dispatch(logout())
      return <Navigate to="/login" state={{ destination }} replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
