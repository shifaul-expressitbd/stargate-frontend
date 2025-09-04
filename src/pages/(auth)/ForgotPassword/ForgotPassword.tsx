import { Button } from '@/components/shared/buttons/button'
import { InputField } from '@/components/shared/forms/input-field'
import { useForgotPasswordMutation } from '@/lib/features/auth/authApi'
import TError from '@/types/TError.type'
import { Validators } from '@/utils/validationUtils'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface FormData {
  credential: string
}

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
        navigate('/reset-password?message=true', { state: { credential } })
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
      <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-cyan-400/30 relative overflow-hidden">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white animate-hologram font-asimovian text-shadow-white-strong tracking-[0.1em] uppercase">
              Portal Lockout
            </h1>
            <p className="mt-2 text-lg text-blue-100 font-orbitron text-shadow-blue-glow">
              Initiate access recovery protocol
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <InputField variant='cosmic'
              label="Quantum Identifier"
              type="text"
              id="credential"
              name="credential"
              placeholder="Enter quantum signature"
              value={credential?.toLowerCase()}
              onChange={handleChange}
              error={errors.credential}
              warning={warnings.credential}
              icon={FaUser}
              autoComplete="credential"
              required
            />

            <Button
              variant="alien-primary"
              size="lg"
              type="submit"
              disabled={loading}
              title="Send Reset Signal"
              className="w-full"
            >
              {loading ? (
                <span className='flex items-center justify-center'>
                  <ImSpinner10 className="animate-spin h-5 w-5 mr-2" />
                  Transmitting...
                </span>
              ) : (
                'Send Reset Signal'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-purple-200 font-orbitron text-shadow-purple-glow">
              Recall your access codes?
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
            <div className="absolute bottom-6 right-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ForgotPassword
