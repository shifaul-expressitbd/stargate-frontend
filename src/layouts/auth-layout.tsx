import AppLogo from '@/components/app/AppLogo'
import { AnimatePresence, motion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

export const AuthLayout = () => {
  const location = useLocation()
  const isRegister = location.pathname === '/register'
  const isLogin = location.pathname === '/login'
  const isForgotPassword = location.pathname.startsWith('/forgot-password')

  const getTitle = () => {
    if (isRegister) return 'Get Started!'
    if (isForgotPassword) return 'Reset Password'
    return 'Welcome Back!'
  }

  const getSubtitle = () => {
    if (isRegister) return 'Create your account and join our platform'
    if (isForgotPassword) return 'Get back into your account'
    return 'Unlock seamless business management with our powerful platform'
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900'>
      {/* Left side - Branding */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-500/20 dark:to-purple-500/20' />
          <div className='relative z-10 text-center max-w-md'>
            <div className='mb-8 flex justify-center'>
              <AppLogo />
            </div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              {getTitle()}
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
              {getSubtitle()}
            </p>
          </div>
          {/* Background decoration */}
          <div className='absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl' />
          <div className='absolute bottom-20 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl' />
        </motion.div>
      </AnimatePresence>

      {/* Right side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='w-full lg:w-1/2 flex items-center justify-center p-6'
      >
        {/* Main Content */}
        <div className='w-full max-w-md mx-auto'>
          <motion.div
            variants={fadeIn}
            initial='initial'
            animate='animate'
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
