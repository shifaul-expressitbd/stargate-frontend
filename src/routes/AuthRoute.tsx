import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { selectCurrentToken, type TUser } from '../lib/features/auth/authSlice'
import { useAppSelector } from '../lib/hooks'
import { verifyToken } from '../utils/verifyToken'

type AuthRouteProps = {
  children: ReactNode
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const token = useAppSelector(selectCurrentToken)
  const location = useLocation()
  const destination = location.state?.destination || '/dashboard'

  if (token) {
    const user = verifyToken(token) as TUser

    // Redirect based on user role
    if (user.role === 'developer') {
      return <Navigate to='/admin/dashboard' replace />
    } else if (user.role === 'user') {
      return <Navigate to={destination} replace />
    }
  }

  // Not logged in, show the auth page (login/register)
  return <>{children}</>
}

export default AuthRoute
