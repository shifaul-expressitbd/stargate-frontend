import { Button } from '@/components/shared/buttons/button'
import { InputField } from '@/components/shared/forms/input-field'
import OTPInput from '@/components/shared/forms/otp-input'
import { useLoginWithBackupCodeMutation, useLoginWithTwoFactorMutation } from '@/lib/features/auth/authApi'
import type { JWTPayload } from '@/lib/features/auth/authSlice'
import { setSidebar, setUser } from '@/lib/features/auth/authSlice'
import { useAppDispatch } from '@/lib/hooks'
import { Validators } from '@/utils/validationUtils'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { FaExclamationTriangle, FaKey, FaShieldAlt } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface TwoFactorVerificationProps {
    email: string
    tempToken: string
    rememberMe: boolean
}

const TwoFactorVerification = ({ email, tempToken, rememberMe }: TwoFactorVerificationProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [verificationMethod, setVerificationMethod] = useState<'totp' | 'backup'>('totp')
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState('')
    const [backupCodeForm, setBackupCodeForm] = useState({ backupCode: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [warnings, setWarnings] = useState<Record<string, string>>({})
    const lastAttemptRef = useRef(0)

    const [loginWithTwoFactor] = useLoginWithTwoFactorMutation()
    const [loginWithBackupCode] = useLoginWithBackupCodeMutation()

    const performTOTPSubmission = async (submitCode: string) => {
        const toastId = toast.loading('Verifying code...', {
            id: '2fa-totp',
            duration: 2000,
        })

        try {
            const res = await loginWithTwoFactor({
                code: submitCode.trim(),
                tempToken,
                rememberMe
            }).unwrap()

            toast.dismiss(toastId)
            completeLogin(res)
        } catch (error: any) {
            toast.dismiss(toastId)
            console.error('2FA verification error:', error)

            if (error?.data?.message?.includes('Invalid 2FA code')) {
                setErrors({ code: 'Invalid verification code' })
                setCode('')
            } else if (error?.data?.message?.includes('Code must be 6 digits')) {
                setErrors({ code: 'Code must be 6 digits' })
                setCode('')
            } else {
                toast.error(error?.data?.message || 'Verification failed. Please try again.', {
                    duration: 3000,
                })
            }
        } finally {
            setLoading(false)
        }
    }

    // Clear errors when switching verification method
    const handleMethodSwitch = (method: 'totp' | 'backup') => {
        setVerificationMethod(method)
        setErrors({})
        setWarnings({})
        setCode('')
        setBackupCodeForm({ backupCode: '' })
    }

    const handleCodeChange = (otp: string) => {
        setCode(otp)

        // Clear errors and warnings when typing
        setErrors({ 'code': '' })
        setWarnings({ 'code': '' })
    }

    const handleCodeComplete = (otp: string) => {
        setCode(otp)

        if (otp.length === 6) {
            if (validateTOTPForm()) {
                // Rate limiting
                const now = Date.now()
                if (now - lastAttemptRef.current < 1000) {
                    return
                }
                lastAttemptRef.current = now
                setLoading(true)
                performTOTPSubmission(otp)
            }
        }
    }

    const handleBackupCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBackupCodeForm(prev => ({ ...prev, [name]: value }))

        // Clear errors and warnings when typing
        setErrors(errors => ({ ...errors, [name]: '' }))
        setWarnings(warnings => ({ ...warnings, [name]: '' }))
    }

    const completeLogin = (res: any) => {
        // Validate response data
        if (!res.data?.accessToken || !res.data?.refreshToken || !res.data?.user) {
            toast.error('Invalid login response. Please try again.', { duration: 2000 })
            return
        }

        // Store tokens securely based on rememberMe preference
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('accessToken', res.data.accessToken)
        storage.setItem('refreshToken', res.data.refreshToken)

        // Decode JWT payload
        try {
            const jwtPayload = jwtDecode<JWTPayload>(res.data.accessToken)

            // Dispatch authenticated user data
            dispatch(
                setUser({
                    user: res.data.user,
                    jwtPayload,
                    token: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                    hasBusiness: res.data.hasBusiness,
                    userProfile: res.data.userProfile,
                    dashboardDesign: res.data.dashboardDesign,
                })
            )

            // Enable sound settings
            localStorage.setItem('playSound', '3')

            if (res?.data?.sideBar) {
                dispatch(setSidebar({ sidebar: res.data.sideBar }))
            }

            toast.success('Login successful! Redirecting...', {
                id: '2fa-login',
                duration: 2000
            })

            const userRoles = jwtPayload.roles || []
            if (userRoles.includes('developer')) {
                navigate('/admin/dashboard', { replace: true })
            } else if (userRoles.includes('user')) {
                navigate('/dashboard', { replace: true })
            } else {
                navigate('/dashboard', { replace: true })
            }
        } catch (decodeError) {
            console.error('Error decoding JWT:', decodeError)
            toast.error('Authentication token is invalid. Please try again.', { duration: 2000 })
        }
    }

    const validateTOTPForm = (): boolean => {
        const validationResult = Validators.code?.(code)
        if (validationResult?.error) {
            setErrors({ code: validationResult.error })
            return false
        }
        if (validationResult?.warning) {
            setWarnings({ code: validationResult.warning })
        }
        return true
    }

    const validateBackupCodeForm = (): boolean => {
        if (!backupCodeForm.backupCode.trim()) {
            setErrors({ backupCode: 'Backup code is required' })
            return false
        }
        if (!/^[A-Z0-9]{8}$/.test(backupCodeForm.backupCode)) {
            setErrors({ backupCode: 'Backup code must be 8 alphanumeric characters' })
            return false
        }
        return true
    }

    const handleTOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Rate limiting
        const now = Date.now()
        if (now - lastAttemptRef.current < 1000) {
            toast.error('Please wait a moment before trying again')
            return
        }
        lastAttemptRef.current = now

        if (!validateTOTPForm()) return

        setLoading(true)
        await performTOTPSubmission(code)
    }

    const handleBackupCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Rate limiting
        const now = Date.now()
        if (now - lastAttemptRef.current < 1000) {
            toast.error('Please wait a moment before trying again')
            return
        }
        lastAttemptRef.current = now

        if (!validateBackupCodeForm()) return

        setLoading(true)
        const toastId = toast.loading('Verifying backup code...', {
            id: '2fa-backup',
            duration: 2000,
        })

        try {
            const res = await loginWithBackupCode({
                email,
                backupCode: backupCodeForm.backupCode,
                tempToken
            }).unwrap()

            toast.dismiss(toastId)
            completeLogin(res)
        } catch (error: any) {
            toast.dismiss(toastId)
            console.error('Backup code verification error:', error)

            if (error?.data?.message?.includes('Invalid backup code')) {
                setErrors({ backupCode: 'Invalid backup code' })
                setBackupCodeForm({ backupCode: '' })
            } else {
                toast.error(error?.data?.message || 'Backup code verification failed. Please try again.', {
                    duration: 3000,
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
            <div className="bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-cyan-400/30 relative overflow-hidden">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white animate-hologram font-orbitron text-shadow-white-strong tracking-[0.1em] uppercase">
                            Two-Factor Authentication
                        </h1>
                        <p className="mt-2 text-lg text-blue-100 font-poppins text-shadow-blue-glow">
                            Enter your verification code to continue
                        </p>
                    </div>

                    {/* Method Selection */}
                    <div className="flex rounded-lg p-1 bg-gray-800/50">
                        <button
                            onClick={() => handleMethodSwitch('totp')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${verificationMethod === 'totp'
                                ? 'bg-cyan-500 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            <FaShieldAlt size={16} />
                            TOTP Code
                        </button>
                        <button
                            onClick={() => handleMethodSwitch('backup')}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${verificationMethod === 'backup'
                                ? 'bg-cyan-500 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            <FaKey size={16} />
                            Backup Code
                        </button>
                    </div>

                    {verificationMethod === 'totp' ? (
                        <form onSubmit={handleTOTPSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white font-poppins text-shadow-blue-glow">
                                    TOTP Code
                                </label>
                                <OTPInput
                                    length={6}
                                    variant='cosmic'
                                    onChange={handleCodeChange}
                                    onComplete={handleCodeComplete}
                                    error={errors.code}
                                />
                            </div>

                            <Button
                                variant="alien-primary"
                                size="lg"
                                type="submit"
                                disabled={loading || !code.trim()}
                                title="Verify TOTP Code"
                                className="w-full"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <ImSpinner10 className="animate-spin h-5 w-5" />
                                        'Verifying...'
                                    </span>
                                ) : (
                                    'Verify Code'
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleBackupCodeSubmit} className="space-y-4">
                            <InputField variant='cosmic'
                                required
                                label="Backup Code"
                                type="text"
                                id="backupCode"
                                name="backupCode"
                                placeholder="Enter 8-character code"
                                value={backupCodeForm.backupCode}
                                onChange={handleBackupCodeChange}
                                error={errors.backupCode}
                                warning={warnings.backupCode}
                                icon={FaKey}
                                maxLength={8}
                                style={{ textTransform: 'uppercase' }}
                            />

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-yellow-300 text-sm">
                                    <FaExclamationTriangle size={14} />
                                    <span className="font-medium">Each backup code can only be used once</span>
                                </div>
                            </div>

                            <Button
                                variant="alien-primary"
                                size="lg"
                                type="submit"
                                disabled={loading || !backupCodeForm.backupCode.trim()}
                                title="Verify Backup Code"
                                className="w-full"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <ImSpinner10 className="animate-spin h-5 w-5" />
                                        'Verifying...'
                                    </span>
                                ) : (
                                    'Verify Backup Code'
                                )}
                            </Button>
                        </form>
                    )}

                    <div className="text-center space-y-2">
                        <p className="text-purple-200 font-poppins text-shadow-purple-glow text-sm">
                            Need help with 2FA?
                        </p>
                        <Link
                            to="/forgot-password"
                            className="text-cyan-300 hover:text-blue-300 font-poppins text-shadow-cyan-glow hover:underline font-bold transition-all duration-200 text-sm"
                        >
                            Reset Authentication Methods
                        </Link>
                    </div>
                </div>

                {/* Cosmic Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl" />

                    <div className="absolute inset-4 border border-cyan-400/20 rounded-xl animate-pulse" />
                    <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" />

                    <div className="absolute top-4 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60" />
                    <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" />
                </div>
            </div>
        </motion.div>
    )
}

export default TwoFactorVerification