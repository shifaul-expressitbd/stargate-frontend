import { InputField } from '@/components/ui/form/input-field'
import { useRegisterMutation } from '@/lib/features/auth/authApi'
import TError from '@/types/TError.type'
import { Validators } from '@/utils/validationUtils'
import { motion } from 'motion/react'
import { useState } from 'react'
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhone,
  FaUser
} from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'

interface FormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const Register = () => {
  const navigate = useNavigate()
  const { setIsHovered } = useOutletContext<{
    setIsHovered: (value: boolean) => void
  }>()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})
  const [register] = useRegisterMutation()

  const sanitizeInput = (value: string): string => {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)
    let updatedForm: FormData
    if (name === 'email') {
      updatedForm = {
        ...formData,
        [name]: sanitizedValue.toLocaleLowerCase()
      }
    } else {
      updatedForm = { ...formData, [name]: sanitizedValue }
    }

    setFormData(updatedForm)

    let error = ''

    if (name === 'confirmPassword') {
      error =
        Validators.confirmPassword(updatedForm.password, sanitizedValue)
          ?.error || ''
    } else {
      error = Validators[name as keyof FormData]?.(sanitizedValue)?.error || ''
    }

    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handlePasswordToggle = () => setShowPassword(!showPassword)
  const handleConfirmPasswordToggle = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const validateForm = (): boolean => {
    const requiredFields: Array<keyof FormData> = [
      'name',
      'email',
      'phone',
      'password',
      'confirmPassword'
    ]
    const newErrors: Record<string, string> = {}
    const newWarnings: Record<string, string> = {}

    requiredFields.forEach(key => {
      if (key === 'confirmPassword') {
        const result = Validators.confirmPassword(
          formData.confirmPassword,
          formData.password
        )
        if (result?.error) newErrors['confirmPassword'] = result.error
        else if (result?.warning)
          newWarnings['confirmPassword'] = result.warning
        return
      }

      const validationResult = Validators[key]?.(formData[key])
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

    if (!validateForm()) return

    setLoading(true)
    const toastId = toast.loading('Creating your account...', {
      id: 'register',
      duration: 2000
    })

    try {
      const res = await register(formData).unwrap()
      const successMsg =
        res?.data?.message ||
        'Registration successful! Please verify your email.'

      toast.success(successMsg, {
        id: toastId,
        duration: 2000
      })
      navigate('/verify-email', {
        state: { user: formData }
      })
    } catch (error) {
      toast.dismiss(toastId)
      if (error instanceof TError) {
        const errorMessage = error?.data?.error[0]?.message
        toast.error(errorMessage, { duration: 2000 })
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
            Create an Account
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Join us to unlock seamless business management
          </p>
        </div>

        <div className='px-4 space-y-2 text-md py-2'>
          <form onSubmit={onSubmit} className='space-y-1' noValidate>
            <InputField
              label='Full Name'
              type='text'
              id='name'
              name='name'
              placeholder='Enter your full name'
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              warning={warnings.name}
              icon={FaUser}
              autoComplete='name'
              required
            />

            <InputField
              label='Email Address'
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email address'
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              warning={warnings.email}
              icon={FaEnvelope}
              autoComplete='email'
              inputMode='email'
              required
            />

            <InputField
              label='Phone Number'
              type='tel'
              id='phone'
              name='phone'
              placeholder='Enter your phone number'
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              warning={warnings.phone}
              icon={FaPhone}
              autoComplete='tel'
              required
              inputMode='numeric' // Shows numeric keyboard on mobile
              pattern='[0-9]*' // Helps with browser validation
              maxLength={11} // Limit to 11 digits
              onKeyDown={e => {
                // Prevent non-numeric key presses
                if (
                  !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)
                ) {
                  e.preventDefault()
                }
              }}
              onPaste={e => {
                // Validate pasted content
                const pasteData = e.clipboardData.getData('text')
                if (!/^\d+$/.test(pasteData)) {
                  e.preventDefault()
                }
              }}
            />

            <InputField
              type={showPassword ? 'text' : 'password'}
              id='password'
              label='Password'
              name='password'
              placeholder='••••••••'
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              warning={warnings.password}
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
              required
            />

            <InputField
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirmPassword'
              label='Confirm Password'
              name='confirmPassword'
              placeholder='••••••••'
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              warning={warnings.confirmPassword}
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
              required
            />

            <motion.button
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              initial={{ scale: 1 }}
              whileHover={{ scale: [0.98, 1] }}
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-lg transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <ImSpinner10 className='animate-spin h-5 w-5 mr-2' />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </motion.button>
          </form>
        </div>

        <div className='flex flex-col items-center justify-center w-full border-t border-gray-300 dark:border-gray-600 p-4'>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?
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

export default Register
