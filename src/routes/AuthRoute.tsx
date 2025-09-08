import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  selectCurrentToken,
  selectCurrentUser,
} from '../lib/features/auth/authSlice'
import { useAppSelector } from '../lib/hooks'

type AuthRouteProps = {
  children: ReactNode
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const token = useAppSelector(selectCurrentToken)
  const user = useAppSelector(selectCurrentUser)
  const jwtPayload = useAppSelector((state) => state.auth.jwtPayload)
  const location = useLocation()
  const destination = location.state?.destination || '/dashboard'

  if (token && user) {
    // Check if user has developer role - redirect to admin
    const roles = jwtPayload?.roles || []
    if (roles.includes('developer')) {
      return <Navigate to='/admin/dashboard' replace />
    } else if (roles.includes('user')) {
      return <Navigate to={destination} replace />
    }

    // Default fallback for other roles
    return <Navigate to={destination} replace />
  }

  // Not logged in, show the auth page (login/register)
  return <>{children}</>
}

export default AuthRoute
