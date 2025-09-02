import { InputField } from '@/components/shared/forms/input-field'
import { useLoginMutation } from '@/lib/features/auth/authApi'
import { setSidebar, setUser, type TUser } from '@/lib/features/auth/authSlice'
import { useAppDispatch } from '@/lib/hooks'
import TError from '@/types/TError.type'
import { Validators } from '@/utils/validationUtils'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { toast } from 'sonner'
import { SocialLogin } from './_components/SocialLogin'

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const destination = location.state?.destination || '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})
  const lastAttemptRef = useRef(0)

  const [login] = useLoginMutation()

  const sanitizeInput = (value: string): string => {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target

    const newValue =
      id === 'credential'
        ? sanitizeInput(value)?.toLowerCase()
        : sanitizeInput(value)

    const sanitizedValue = type === 'checkbox' ? checked : newValue
    setFormData((prev) => ({
      ...prev,
      [id]: sanitizedValue,
    }))

    // Clear errors and warnings when typing
    setErrors((prev) => ({ ...prev, [id]: '' }))
    setWarnings((prev) => ({ ...prev, [id]: '' }))
  }

  const handlePasswordToggle = () => setShowPassword(!showPassword)

  const validateForm = (): boolean => {
    const requiredFields: Array<keyof FormData> = ['email', 'password']
    const newErrors: Record<string, string> = {}
    const newWarnings: Record<string, string> = {}

    requiredFields.forEach((key) => {
      const validationResult = Validators[key]?.(formData[key] as string)
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
    const toastId = toast.loading('Logging in...', {
      id: 'login',
      duration: 2000,
    })

    try {
      const res = await login(formData).unwrap()
      console.log('Login response:', res)
      Cookies.set('token', res.data.accessToken, {
        expires: formData.rememberMe ? 7 : undefined,
        secure: true,
        sameSite: 'strict',
      })

      const user = jwtDecode<TUser>(res.data.accessToken)
      // Clear password field
      setFormData((prev) => ({ ...prev, password: '' }))

      // Dispatch user data
      dispatch(
        setUser({
          user,
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          hasBusiness: res.data.hasBusiness,
          userProfile: res.data.userProfile,
          dashboardDesign: res.data.dashboardDesign,
        })
      )

      //sound enabled
      localStorage.setItem('playSound', '3')

      const sidebar = res?.data?.sideBar
      if (!sidebar || (Array.isArray(sidebar) && sidebar?.length === 0)) {
        // optionally show a toast here
        // dispatch(logout())
        return
      }

      toast.success('Login successful! Redirecting...', {
        id: toastId,
        duration: 2000
      })

      // Use replace: true to prevent going back to login page
      if (user.role === 'developer') {
        navigate(destination, { replace: true })
      } else if (user.role === 'user') {
        navigate(res.data.hasBusiness ? destination : '/onboarding', {
          replace: true,
        })
      }

      dispatch(setSidebar({ sidebar: res.data.sideBar }))
    } catch (error) {
      toast.dismiss(toastId)
      if (error instanceof TError) {
        const errorMessage = error?.data?.message
        toast.error(errorMessage, { duration: 2000 })
        if (
          error.status === 403 &&
          errorMessage === 'First Verify your Email then login!'
        ) {
          navigate('/user/verify-otp')
        }
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'data' in error
      ) {
        const errorMsg = (error as { data: { message: string } }).data?.message
        toast.error(errorMsg, {
          duration: 2000,
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
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Access your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              required
              label="Email Address"
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              warning={warnings.email}
              icon={FaUser}
              autoComplete="email"
              inputMode="email"
            />

            <InputField
              required
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              label="Password"
              labelRightElement={
                <Link
                  to="/forgot-password"
                  className="text-orange-600 hover:text-orange-700 dark:text-primary transition-colors hover:underline text-sm"
                >
                  Forgot?
                </Link>
              }
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              warning={warnings.password}
              icon={FaLock}
              rightElement={
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              }
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: [0.98, 1] }}
              transition={{ duration: 0.2 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg transition-all cursor-pointer hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <ImSpinner10 className="animate-spin h-5 w-5" />
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <SocialLogin />

          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              {"Don't have an account?"}
            </p>
            <Link
              to="/register"
              className="text-primary hover:text-secondary transition-colors font-medium"
            >
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
