import type { JWTPayload } from '@/lib/features/auth/authSlice'
import { jwtDecode } from 'jwt-decode'

export const verifyToken = (token: string): JWTPayload => {
  const decoded = jwtDecode(token) as JWTPayload

  // Validate that we have the expected fields from JWTPayload
  if (!decoded.sub || !decoded.roles || !Array.isArray(decoded.roles)) {
    throw new Error('Invalid JWT structure')
  }

  return decoded
}
