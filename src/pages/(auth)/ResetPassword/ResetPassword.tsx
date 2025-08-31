import { InputField } from '@/components/ui/form/input-field'
import { useResetPasswordMutation } from '@/lib/features/auth/authApi'
import TError from '@/types/TError.type'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext
} from 'react-router-dom'
import { toast } from 'sonner'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { credential } = location.state || {}
  const [loading, setLoading] = useState(false)
  const { setIsHovered } = useOutletContext<{
    setIsHovered: (value: boolean) => void
  }>()
  const [formData, setFormData] = useState({
    credential: credential || '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const lastAttemptRef = useRef(0)

  const [resetPassword] = useResetPasswordMutation()

  const sanitizeInput = (value: string): string => {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const sanitizedValue = sanitizeInput(value)

    setFormData(prev => ({
      ...prev,
      [id]: sanitizedValue,
      credential: credential || ''
    }))
    setErrors(prev => ({ ...prev, [id]: '' }))
  }

  const handlePasswordToggle = () => setShowPassword(!showPassword)
  const handleConfirmPasswordToggle = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Rate limiting
    const now = Date.now()
    if (now - lastAttemptRef.current < 1000) {
      toast.error('Please wait a moment before trying again')
      return
    }
    lastAttemptRef.current = now

    if (!validateForm()) return

    setLoading(true)
    const toastId = toast.loading('Resetting password...', {
      id: 'verify-pass',
      duration: 2000
    })

    try {
      await resetPassword({
        credential: formData.credential?.toLowerCase(),
        newPassword: formData.newPassword
      }).unwrap()

      toast.success('Password reset successfully! Redirecting to login...', {
        id: toastId,
        duration: 2000
      })

      navigate('/login', { state: { credential: formData.credential } })
    } catch (error) {
      toast.dismiss(toastId)
      if (error instanceof TError) {
        const errorMessage =
          error.message ||
          error?.data?.message ||
          error.data.errors ||
          error?.data?.error?.[0]?.message
        toast.error(errorMessage, { duration: 2000 })
      } else {
        toast.error('An error occurred while resetting password', {
          duration: 2000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex items-center justify-center'
    >
      <div className='w-full md:w-96 bg-white dark:bg-black shadow-md rounded-2xl overflow-hidden space-y-2'>
        <div className='px-4 pt-4'>
          <h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
            Reset Password
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Create a new password for your account
          </p>
        </div>

        <div className='px-4 space-y-2 text-md py-2'>
          <form onSubmit={handleSubmit} className='space-y-2' noValidate>
            <InputField
              type={showPassword ? 'text' : 'password'}
              id='newPassword'
              label='New Password'
              placeholder='••••••••'
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              icon={FaLock}
              autoComplete='new-password'
              rightElement={
                <button
                  type='button'
                  onClick={handlePasswordToggle}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer'
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              }
            />

            <InputField
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirmPassword'
              label='Confirm Password'
              placeholder='••••••••'
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={FaLock}
              autoComplete='new-password'
              rightElement={
                <button
                  type='button'
                  onClick={handleConfirmPasswordToggle}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer'
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              }
            />

            <motion.button
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              initial={{ scale: 1 }}
              whileHover={{ scale: [0.95, 1] }}
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed'
            >
              {loading ? (
                <ImSpinner10 className='animate-spin h-6 w-6' />
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </form>
        </div>

        <div className='flex flex-col items-center justify-center w-full border-t border-gray-300 p-4'>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Remember your password?
          </div>
          <Link
            to='/login'
            className='text-lg font-semibold text-secondary hover:text-primary transition-colors'
          >
            Login
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ResetPassword
