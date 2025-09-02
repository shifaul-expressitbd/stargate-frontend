import { Button } from '@/components/shared/buttons/button'
import OTPInput from '@/components/shared/forms/otp-input'
import {
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation
} from '@/lib/features/auth/authApi'
import TError from '@/types/TError.type'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ImSpinner10 } from 'react-icons/im'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const VerifyForgotPasswordOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(120)
  const [attemptLeft, setAttemptLeft] = useState(5)

  // Get the email from the location state
  const { credential } = location.state

  const [forgotPassword] = useForgotPasswordMutation()
  const [verifyForgotPasswordOtp] = useVerifyForgotPasswordOtpMutation()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (otp.length !== 6) {
      newErrors.otp = 'Please enter a valid 6-digit OTP.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    if (attemptLeft == 0) return

    setLoading(true)
    setAttemptLeft(Number(attemptLeft) - 1)

    const toastId = toast.loading('Verifying...', {
      id: 'verify-pass-otp',
      duration: 2000
    })

    try {
      await verifyForgotPasswordOtp({ credential, otp }).unwrap()

      toast.success('Identity verified successfully!', {
        id: toastId,
        duration: 2000
      })

      // { replace: true })
      setTimeout(() => {
        navigate('/reset-password', { state: { credential } })
      }, 2000)
    } catch (error) {
      toast.dismiss(toastId)
      if (error instanceof TError) {
        const errorMessage =
          error.message ||
          error?.data?.message ||
          error.data.errors ||
          error?.data?.error?.[0]?.message
        toast.error(errorMessage, {
          id: 'verify-pass-otp',
          duration: 2000
        })
      } else {
        toast.error('An error occurred', {
          id: 'verify-pass-otp',
          duration: 2000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle resend code functionality
  const handleResendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setResendDisabled(true)
    const toastId = toast.loading('Sending code...')
    try {
      await forgotPassword(credential).unwrap()
      setCountdown(120)
      toast.success('Verification code resent successfully!', {
        id: toastId,
        duration: 2000
      })
    } catch (error) {
      toast.dismiss(toastId)
      if (error instanceof TError) {
        const errorMessage =
          error.message ||
          error?.data?.message ||
          error.data.errors ||
          error?.data?.error?.[0]?.message
        toast.error(errorMessage, { id: toastId, duration: 2000 })
      } else {
        toast.error('An error occurred', { id: toastId, duration: 2000 })
      }
    } finally {
      setLoading(false)
    }
  }

  // Countdown timer effect
  useEffect(() => {
    if (resendDisabled && countdown > 0 && attemptLeft > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setResendDisabled(false)
    }
  }, [resendDisabled, countdown, attemptLeft])

  useEffect(() => {
    if (!credential) {
      navigate('/forgot-password', { replace: true })
    }
  }, [credential, navigate])

  if (!credential) {
    return <div>Redirecting...</div>
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex items-center justify-center'
    >
      <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-cyan-400/30 relative overflow-hidden">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white animate-hologram font-asimovian text-shadow-white-strong tracking-[0.1em] uppercase">
              Quantum Verification
            </h1>
            <p className="mt-2 text-lg text-blue-100 font-orbitron text-shadow-blue-glow">
              Decode the interdimensional transmission
            </p>
          </div>

          {/* Verification Code Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* OTP Input */}
            <OTPInput length={6} onChange={setOtp} error={errors.otp} />

            {/* Submit Button */}
            <div className="pb-2">
              <Button
                variant="alien-primary"
                size="lg"
                type="submit"
                disabled={loading || attemptLeft == 0}
                title="Verify Signal"
                className="w-full"
              >
                {loading ? (
                  <>
                    <ImSpinner10 className="animate-spin h-5 w-5 mr-2" />
                    Scanning...
                  </>
                ) : (
                  `Verify Signal (${attemptLeft})`
                )}
              </Button>
            </div>
          </form>

          <div className="flex flex-col items-center justify-center w-full p-4">
            <div className="text-purple-200 font-orbitron text-shadow-purple-glow">
              Transmission interrupted?
            </div>
            <button
              onClick={handleResendCode}
              disabled={resendDisabled || attemptLeft == 0}
              className="text-cyan-300 hover:text-blue-300 font-orbitron text-shadow-cyan-glow hover:underline font-bold transition-all duration-200 disabled:text-gray-500 disabled:hover:text-gray-500 disabled:cursor-not-allowed"
              style={resendDisabled || attemptLeft == 0 ? {} : { textShadow: '0 0 5px rgba(34, 211, 238, 0.5)' }}
            >
              {attemptLeft
                ? resendDisabled
                  ? `Resend in ${countdown}s`
                  : 'Reinforce Signal'
                : 'Try again after 1 hour'}
            </button>
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
      </div>
    </motion.div>
  )
}

export default VerifyForgotPasswordOtp
