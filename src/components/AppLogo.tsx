import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoWhite from '/images/logo/logo-white.png'
import logo from '/images/logo/logo.png'
const CalQuickLogo = () => {
  const [hasImageError, setHasImageError] = useState(false)
  const { user, hasBusiness } = useAuth()
  let url
  if (user?.role === 'developer') {
    url = '/admin/dashboard'
  } else if (user?.role === 'user' && hasBusiness === false) {
    url = '/onboarding'
  } else if (user?.role === 'user' && hasBusiness === true) {
    url = '/dashboard'
  } else {
    url = '/'
  }

  return (
    <Link to={url}>
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="CalQuick"
          onError={() => setHasImageError(true)}
          className={`${
            hasImageError ? 'dark:hidden' : 'block'
          } w-28 h-full object-contain dark:hidden`}
        />
        <img
          src={logoWhite}
          alt="CalQuick"
          onError={() => setHasImageError(true)}
          className={`${
            hasImageError ? 'hidden' : 'dark:block'
          } w-28 h-full object-contain hidden`}
        />
        <span className=" text-black dark:text-white font-bold text-sm">
          Beta
        </span>

        {hasImageError && (
          <h1 className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-white font-pollinator whitespace-nowrap">
            CalQuick
          </h1>
        )}
      </div>
    </Link>
  )
}

export default CalQuickLogo
