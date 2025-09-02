import { Button } from '@/components/shared/buttons/button'
import { InputField } from '@/components/shared/forms/input-field'
import { useResetPasswordMutation } from '@/lib/features/auth/authApi'
import TError from '@/types/TError.type'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { toast } from 'sonner'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { credential } = location.state || {}
  const [loading, setLoading] = useState(false)
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
      <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-cyan-400/30 relative overflow-hidden">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white animate-hologram font-asimovian text-shadow-white-strong tracking-[0.1em] uppercase">
              Quantum Reset
            </h1>
            <p className="mt-2 text-lg text-blue-100 font-orbitron text-shadow-blue-glow">
              Reinitialize your access codes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              label="New Quantum Code"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              icon={FaLock}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
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
              id="confirmPassword"
              label="Confirm Quantum Code"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={FaLock}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={handleConfirmPasswordToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              }
            />

            <Button
              variant="alien-primary"
              size="lg"
              type="submit"
              disabled={loading}
              title="Reset Access Codes"
              className="w-full"
            >
              {loading ? (
                <>
                  <ImSpinner10 className="animate-spin h-5 w-5 mr-2" />
                  Reinitializing...
                </>
              ) : (
                'Reinitialize Access'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-purple-200 font-orbitron text-shadow-purple-glow">
              Recall your original codes?
            </p>
            <Link
              to="/login"
              className="text-cyan-300 hover:text-blue-300 font-orbitron text-shadow-cyan-glow hover:underline font-bold transition-all duration-200"
              style={{
                textShadow: '0 0 5px rgba(34, 211, 238, 0.5)'
              }}
            >
              Re-enter Stargate
            </Link>
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

export default ResetPassword
