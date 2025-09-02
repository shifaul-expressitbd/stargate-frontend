import { navbarRef } from '@/lib/refs'
import { useState } from 'react'
import { FiMaximize, FiMinimize } from 'react-icons/fi'
import { MdLogout } from 'react-icons/md'

import { SidebarToggler } from '../sidebar/sidebarToggler'

import AppLogo from '@/components/app/AppLogo'
import ThemeToggler from '@/components/layout/navbar/themeToggler'
import { Icon } from '@/components/shared/icons/icon'
import { notificationsData } from '@/config/notification.config'
import NotificationsDropdown from './notification-btn'


interface NavbarProps {
  className?: string
  handleLogout: () => void
}

export const Navbar = ({ className, handleLogout }: NavbarProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }

  return (
    <header
      ref={navbarRef}
      className={`p-3 sm:p-4 md:p-5 w-full flex bg-white dark:bg-primary-dark  z-50 justify-between items-center transition-all duration-200 ${className}`}
    >
      <div className="flex gap-2 sm:gap-3 items-center dark:text-white">
        <SidebarToggler />
        <AppLogo />
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
        <button
          onClick={toggleFullScreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-500 cursor-pointer transition-colors text-primary dark:text-white"
          aria-label="Fullscreen Toggle"
        >
          <Icon
            icon={isFullscreen ? FiMinimize : FiMaximize}
            size={18}
            className="sm:size-5"
          />
        </button>

        <NotificationsDropdown notifications={notificationsData} />

        <ThemeToggler />

        <button
          title="Sign Out"
          onClick={handleLogout}
          className="block lg:hidden p-2 rounded-full bg-gray-200 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-500 cursor-pointer transition-colors text-primary dark:text-white"
          aria-label="Sign Out"
        >
          <MdLogout className="size-4" />
        </button>
      </div>
    </header>
  )
}
