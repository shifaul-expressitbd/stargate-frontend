// src/components/ProtectedRoute.tsx
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  logout,
  selectCurrentToken,
  type TUser,
} from '../lib/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { verifyToken } from '../utils/verifyToken'

type ProtectedRouteProps = {
  children: ReactNode
  roles: string[] // ← now an array
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectCurrentToken)
  const location = useLocation()

  const pathname = location?.pathname + location.search
  const destination = pathname?.startsWith('/admin') ? undefined : pathname

  if (!token) {
    // not logged in
    return <Navigate to='/login' replace state={{ destination: destination }} />
  }

  const user = verifyToken(token) as TUser

  // if roles defined and user.role not in the list → logout + redirect
  if (roles.length > 0 && !roles.includes(user.role)) {
    dispatch(logout())
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
