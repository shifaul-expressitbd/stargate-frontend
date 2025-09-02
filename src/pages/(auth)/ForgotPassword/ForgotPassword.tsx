import { InputField } from '@/components/shared/forms/input-field'
import { useForgotPasswordMutation } from '@/lib/features/auth/authApi'
import TError from '@/types/TError.type'
import { Validators } from '@/utils/validationUtils'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'

interface FormData {
  credential: string
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { setIsHovered } = useOutletContext<{
    setIsHovered: (value: boolean) => void
  }>()
  const [credential, setCredential] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})
  const lastAttemptRef = useRef(0)
  const [forgotPassword] = useForgotPasswordMutation()

  const sanitizeInput = (value: string): string => {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)

    setCredential(sanitizedValue?.toLowerCase())

    // Clear errors and warnings when typing
    setErrors(prev => ({ ...prev, [name]: '' }))
    setWarnings(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = (): boolean => {
    const requiredFields: Array<keyof FormData> = ['credential']
    const newErrors: Record<string, string> = {}
    const newWarnings: Record<string, string> = {}

    requiredFields.forEach(key => {
      const validationResult = Validators[key]?.(credential)
      if (validationResult?.error) {
        newErrors[key] = validationResult.error
      }
      if (validationResult?.warning) {
        newWarnings[key] = validationResult.warning
      }
    })

    setErrors(newErrors)
    setWarnings(newWarnings)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
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
    const toastId = toast.loading('Sending reset instructions...')

    try {
      // Send the credential in the correct payload format
      const res = await forgotPassword(credential).unwrap()

      toast.success(
        res.message || 'Reset instructions sent! Check your email',
        {
          id: toastId,
          duration: 2000
        }
      )
      setTimeout(() => {
        navigate('/verify-otp', { state: { credential } })
      }, 1000)
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
        toast.error('An error occurred', { duration: 2000 })
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
            Forgot Password?
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Enter your email or phone to reset your password
          </p>
        </div>

        <div className='px-4 space-y-2 text-md py-2'>
          <form onSubmit={onSubmit} className='space-y-2' noValidate>
            <InputField
              id='credential'
              label='Email or Phone'
              type='text'
              name='credential'
              placeholder='Enter your email or phone'
              value={credential?.toLowerCase()}
              onChange={handleChange}
              error={errors.credential}
              warning={warnings.credential}
              icon={FaUser}
              autoComplete='credential'
              required
            />

            <motion.button
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              initial={{ scale: 1 }}
              whileHover={{ scale: [0.95, 1] }}
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center bg-primary hover:bg-secondary text-gray-900 hover:text-white font-semibold py-2 rounded-lg transition-all cursor-pointer disabled:text-gray-900 disabled:cursor-not-allowed'
            >
              {loading ? (
                <ImSpinner10 className='animate-spin h-6 w-6' />
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>
        </div>

        <div className='flex flex-col items-center justify-center w-full border-t border-gray-300 dark:border-gray-600 p-4'>
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

export default ForgotPassword
