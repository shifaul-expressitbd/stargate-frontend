import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoWhite from '/images/logo/logo-white.png'
import logo from '/images/logo/logo.png'

interface AppLogoProps {
  variant?: 'default' | 'landing'
  size?: 'sm' | 'md' | 'lg'
}

const AppLogo = ({ variant = 'default', size = 'md' }: AppLogoProps = {}) => {
  const [hasImageError, setHasImageError] = useState(false)
  const { user, hasBusiness } = useAuth()

  let url = '/'
  if (variant === 'default') {
    if (user?.role === 'developer') {
      url = '/admin/dashboard'
    } else if (user?.role === 'user' && hasBusiness === false) {
      url = '/onboarding'
    } else if (user?.role === 'user' && hasBusiness === true) {
      url = '/dashboard'
    } else {
      url = '/'
    }
  } else if (variant === 'landing') {
    // For landing page, always go to root by default
    url = '/'
  }

  const sizeClasses = {
    sm: 'w-20',
    md: 'w-28',
    lg: 'w-32'
  }

  const textSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl md:text-2xl',
    lg: 'text-xl sm:text-2xl md:text-3xl'
  }

  return (
    <Link to={url} className="hover:opacity-80 transition-opacity">
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="StarGate"
          onError={() => setHasImageError(true)}
          className={`${hasImageError ? 'dark:hidden' : 'block'
            } ${sizeClasses[size]} h-12 object-contain dark:hidden`}
        />
        <img
          src={logoWhite}
          alt="StarGate"
          onError={() => setHasImageError(true)}
          className={`${hasImageError ? 'hidden' : 'dark:block'
            } ${sizeClasses[size]} h-12 object-contain hidden`}
        />

        {hasImageError && (
          <h1 className={`${textSizeClasses[size]} text-gray-700 dark:text-white font-pollinator whitespace-nowrap hover:scale-105 transition-transform`}>
            StarGate
          </h1>
        )}
      </div>
    </Link>
  )
}

export default AppLogo
