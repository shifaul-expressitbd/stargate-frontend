import AppLogo from '@/components/app/AppLogo'
import BackgroundAnimation from '@/pages/LandingPage/_components/BackgroundAnimation'
import { motion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'

// Hologram effect styles
const hologramStyles = `
@keyframes hologram-flicker {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.9; }
  15% { opacity: 1; }
  70% { opacity: 0.95; }
  85% { opacity: 1; }
}

.animate-hologram {
  animation: hologram-flicker 4s ease-in-out infinite;
}
`

const HologramStyle = () => <style dangerouslySetInnerHTML={{ __html: hologramStyles }} />

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

export const AuthLayout = () => {
  const location = useLocation()
  const isRegister = location.pathname === '/register'
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
    <div className='relative overflow-hidden'>
      <HologramStyle />
      <BackgroundAnimation />
      <div className='min-h-screen w-full flex relative bg-black'>
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20' />
          <div className='relative z-10 text-center max-w-md'>
            <div className='mb-8 flex justify-center'>
              <AppLogo />
            </div>
            <h1 className='text-4xl md:text-5xl font-bold text-white animate-hologram font-orbitron text-shadow-white-strong mb-6 tracking-[0.1em] uppercase'>
              {getTitle()}
            </h1>
            <p className='text-xl text-blue-100 max-w-2xl leading-relaxed font-poppins text-shadow-blue-glow'>
              {getSubtitle()}
            </p>
          </div>
          {/* Background decoration */}
          <div className='absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl' />
          <div className='absolute bottom-20 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl' />
        </motion.div>
        {/* Right side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='w-full lg:w-1/2 flex items-center justify-center p-6 z-10'
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
    </div>
  )
}
