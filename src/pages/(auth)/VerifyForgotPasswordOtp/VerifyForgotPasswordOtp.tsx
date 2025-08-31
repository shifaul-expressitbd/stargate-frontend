import OTPInput from '@/components/shared/forms/otp-input'
import {
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation
} from '@/lib/features/auth/authApi'
import TError from '@/types/TError.type'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ImSpinner10 } from 'react-icons/im'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'

const VerifyForgotPasswordOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false)
  const { setIsHovered } = useOutletContext<{
    setIsHovered: (value: boolean) => void
  }>()
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
      <div className='max-w-full w-96 bg-white dark:bg-black shadow-md rounded-2xl overflow-hidden space-y-2'>
        <div className='px-4 pt-4'>
          <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
            Verify Your Identity
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Enter the verification code sent to your email
          </p>
        </div>

        <div className='px-4 space-y-2'>
          {/* Verification Code Form */}
          <form onSubmit={handleSubmit} className='space-y-2' noValidate>
            {/* OTP Input */}
            <OTPInput length={6} onChange={setOtp} error={errors.otp} />

            {/* Submit Button */}
            <div className='pb-2'>
              <motion.button
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                initial={{ scale: 1 }}
                whileHover={{ scale: [0.95, 1] }}
                type='submit'
                disabled={loading || attemptLeft == 0}
                className='auth-button'
              >
                {loading ? (
                  <>
                    <ImSpinner10 className='animate-spin h-6 w-6' />
                  </>
                ) : (
                  `Verify Email (${attemptLeft})`
                )}
              </motion.button>
            </div>
          </form>
        </div>

        <div className='flex flex-col items-center justify-center w-full border-t border-gray-300 dark:border-gray-600 p-4'>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            {"Didn't receive the code?"}
          </div>
          <button
            onClick={handleResendCode}
            disabled={resendDisabled || attemptLeft == 0}
            className='font-semibold text-lg disabled:text-gray-400 text-secondary hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed'
          >
            {attemptLeft
              ? resendDisabled
                ? `Resend in ${countdown}s`
                : 'Resend Code'
              : 'Try again after 1 hour'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default VerifyForgotPasswordOtp
