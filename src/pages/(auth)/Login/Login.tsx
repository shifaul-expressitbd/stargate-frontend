import { InputField } from '@/components/ui/form/input-field'
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
  useNavigate,
  useOutletContext,
} from 'react-router-dom'
import { toast } from 'sonner'

interface FormData {
  credential: string
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
  const { setIsHovered } = useOutletContext<{
    setIsHovered: (value: boolean) => void
  }>()
  const [formData, setFormData] = useState({
    credential: '',
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
    const requiredFields: Array<keyof FormData> = ['credential', 'password']
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
      // console.log('Login response:', res)
      // console.log(res.data.hasBusiness)
      Cookies.set('token', res.data.token, {
        expires: formData.rememberMe ? 7 : undefined,
        secure: true,
        sameSite: 'strict',
      })

      const user = jwtDecode<TUser>(res.data.token)
      // Clear password field
      setFormData((prev) => ({ ...prev, password: '' }))

      // Dispatch user data
      dispatch(
        setUser({
          user,
          token: res.data.token,
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
      className="flex items-center justify-center"
    >
      <div className="w-full md:w-96 bg-white dark:bg-black shadow-md rounded-2xl overflow-hidden space-y-2">
        <div className="px-4 pt-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Welcome!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Unlock Seamless Business Management
          </p>
        </div>

        <div className="px-4 space-y-2 text-md py-2">
          <form onSubmit={handleSubmit} className="space-y-2" noValidate>
            <InputField
              required
              label="Email or Phone"
              type="text"
              id="credential"
              name="credential"
              placeholder="Enter Your Email or Phone"
              value={formData.credential}
              onChange={handleChange}
              error={errors.credential}
              warning={warnings.credential}
              icon={FaUser}
              autoComplete="credential"
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
                  className="text-orange-600 hover:text-orange-700 dark:hover:text-primary transition-colors hover:underline"
                >
                  Forgot password?
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
                className="cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <motion.button
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              initial={{ scale: 1 }}
              whileHover={{ scale: [0.95, 1] }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <ImSpinner10 className="animate-spin h-6 w-6" />
              ) : (
                'Login'
              )}
            </motion.button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center w-full border-t border-gray-300 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {"Don't have an account?"}
          </div>
          <Link
            to="/register"
            className="text-lg font-semibold text-secondary hover:text-primary transition-colors"
          >
            Sign up Now
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
