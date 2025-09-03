import { Button } from '@/components/shared/buttons/button'
import { useResendVerificationEmailMutation, useVerifyNewUserMutation } from '@/lib/features/auth/authApi'
import {
  setSidebar,
  setUser
} from '@/lib/features/auth/authSlice'
import { useAppDispatch } from '@/lib/hooks'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const VerifyNewUser = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const [verifyNewUser, { isLoading, isSuccess, data, error, isError }] = useVerifyNewUserMutation() as any
  const [verificationTriggered, setVerificationTriggered] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [isDisabled, setIsDisabled] = useState(true)
  const [resendCount, setResendCount] = useState(0)

  // Get token and message from URL
  const token = searchParams.get('token')
  const message = searchParams.get('message')

  // Handle token-based verification from URL
  useEffect(() => {
    if (token && !verificationTriggered && !isLoading && !isSuccess && !isError) {
      setVerificationTriggered(true)
      verifyNewUser(token)
    }
  }, [token, verificationTriggered, isLoading, isSuccess, isError, verifyNewUser])

  // Redirect to register if no token and no message
  useEffect(() => {
    if (!token && !message) {
      navigate('/register')
    }
  }, [token, message, navigate])

  // Handle successful verification
  useEffect(() => {
    if (isSuccess && data) {
      // Handle success
      if (data.data?.user) {
        // If token and sidebar are provided, set them (login after verification)
        if (data.data.token && data.data.sideBar) {
          dispatch(setUser({ user: data.data.user, token: data.data.token }))
          dispatch(setSidebar({ sidebar: data.data.sideBar }))
        } else if (data.data.token) {
          dispatch(setUser({ user: data.data.user, token: data.data.token }))
        }
      }

      // Play sound for success
      if (data.data?.token || data.data?.sideBar) {
        localStorage.setItem('playSound', '3')
      }

      toast.success('Email verified successfully!', {
        duration: 2000
      })

      // Redirect based on what was returned
      let redirectTo = '/login' // Default fallback
      if (data.data?.redirectUrl) {
        redirectTo = data.data.redirectUrl
      } else if (data.data?.token && data.data?.sideBar) {
        redirectTo = '/onboarding'
      }

      setTimeout(() => navigate(redirectTo), 2000)
    }
  }, [isSuccess, data, dispatch, navigate])

  // Handle error
  useEffect(() => {
    if (isError && error) {
      const errorMessage = error.data?.message || 'Invalid or expired verification token'
      toast.error(errorMessage, { duration: 2000 })
    }
  }, [isError, error])

  // Countdown effect
  useEffect(() => {
    if (countdown > 0 && isDisabled) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (countdown === 0) {
      setIsDisabled(false)
    }
  }, [countdown, isDisabled])

  // Handle resend
  const handleResend = async () => {
    // Get email from navigation state first, fallback to localStorage
    const email = location.state?.email || localStorage.getItem('verificationEmail')
    if (!email) {
      toast.error('No email found. Please register again.')
      return
    }

    try {
      const resendTime = resendCount === 0 ? 60 : 120
      await resendVerificationEmail(email).unwrap()
      toast.success('Verification email resent!')
      setCountdown(resendTime)
      setIsDisabled(true)
      setResendCount(prev => prev + 1)
    } catch (error) {
      toast.error('Failed to resend email.')
    }
  }

  // If message param exists and no token, show message to check email
  if (message && !token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-center'
      >
        <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-cyan-400/30 relative overflow-hidden">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white animate-hologram font-asimovian text-shadow-white-strong tracking-[0.1em] uppercase">
              Check Your Email
            </h1>
            <p className="mt-2 text-lg text-blue-100 font-orbitron text-shadow-blue-glow">
              We've sent a verification link to your email address.
            </p>
            <p className="text-blue-100 text-sm">
              Click the link to verify your account and continue.
            </p>
            <Button
              title='Resend Verification Email'
              variant="alien-primary"
              size="lg"
              disabled={isDisabled}
              onClick={handleResend}
              className="mt-4"
            >
              {isDisabled ? `Resend Email (${countdown}s)` : 'Resend Verification Email'}
            </Button>
          </div>
          {/* Cosmic Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl" />
            <div className="absolute inset-4 border border-cyan-400/20 rounded-xl animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-4 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60" style={{ animationDuration: '2s' }} />
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
          </div>
        </div>
      </motion.div>
    )
  }

  // If token is being verified, show loading
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-center'
      >
        <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-cyan-400/30 relative overflow-hidden">
          <div className="text-center space-y-4">
            <ImSpinner10 className="animate-spin h-12 w-12 mx-auto text-cyan-400" />
            <h1 className="text-2xl font-bold text-white font-orbitron">
              Verifying Email...
            </h1>
            <p className="text-blue-100">Please wait while we confirm your identity</p>
            <Link
              to={{ pathname: '/verify-email', search: 'message=true' }}
              state={{ email: location.state?.email || localStorage.getItem('verificationEmail') }}
              className='text-cyan-300 hover:text-blue-300 font-orbitron text-shadow-cyan-glow hover:underline font-bold transition-all duration-200'
            >
              Didn't receive the email? Click here to resend
            </Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl" />
            <div className="absolute inset-4 border border-cyan-400/20 rounded-xl animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
        </div>
      </motion.div>
    )
  }

  // If verification successful, show success message
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-center'
      >
        <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-green-400/30 relative overflow-hidden">
          <div className="text-center space-y-4">
            <FaCheckCircle className="h-12 w-12 mx-auto text-green-400" />
            <h1 className="text-2xl font-bold text-white font-orbitron">
              Email Verified Successfully!
            </h1>
            <p className="text-blue-100">Redirecting to login page...</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/5 to-purple-500/5 rounded-2xl" />
            <div className="absolute inset-4 border border-green-400/20 rounded-xl animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
        </div>
      </motion.div>
    )
  }

  // If error, show error message with resend option if applicable
  if (isError) {
    const errorMessage = error?.data?.message || 'Invalid or expired verification token'
    const errorCode = error?.data?.code

    // Check if this is an invalid token error for a potentially existing user
    const isInvalidTokenForExistingUser = errorCode === 'INVALID_TOKEN' || errorMessage.includes('Invalid or expired verification token')

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-center'
      >
        <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-red-400/30 relative overflow-hidden">
          <div className="text-center space-y-4">
            <FaTimesCircle className="h-12 w-12 mx-auto text-red-400" />
            <h1 className="text-2xl font-bold text-white font-orbitron">
              Verification Failed
            </h1>
            <p className="text-blue-100">{errorMessage}</p>

            {isInvalidTokenForExistingUser && (
              <div className="space-y-3">
                <p className="text-blue-100 text-sm">
                  The verification link may have expired or been used. We can send you a new one if your account exists.
                </p>
                <Button
                  title='Resend Verification Email'
                  variant="alien-primary"
                  size="lg"
                  disabled={isDisabled}
                  onClick={handleResend}
                  className="mt-4"
                >
                  {isDisabled ? `Resend Email (${countdown}s)` : 'Resend Verification Email'}
                </Button>
              </div>
            )}

            {!isInvalidTokenForExistingUser && (
              <p className="text-blue-100 text-sm">Please try again or contact support.</p>
            )}
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/5 to-purple-500/5 rounded-2xl" />
            <div className="absolute inset-4 border border-red-400/20 rounded-xl animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}

export default VerifyNewUser

