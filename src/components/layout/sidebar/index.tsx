import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { sidebarRef } from '@/lib/refs'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import {
  adminMenuItems,
  useUserMenuItems,
  type MenuItem
} from '@/config/routes.config'
import { useSidebar } from '@/hooks/useSidebar'

import Image from '@/components/shared/data-display/image'
import avatar from '/images/avatar/avatar1.png'

interface SidebarProps {
  handleLogout: () => void
}

export const Sidebar = ({ handleLogout }: SidebarProps) => {
  const { pathname } = useLocation()
  const { isSidebarOpen, isDesktop, close } = useSidebar()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const { user } = useAuth()
  // console.log('user', user)
  // console.log('sidebar', sidebar)
  const userMenuItems = useUserMenuItems()
  const { isExpired, remainingTime } = useSubscription(user?.warning_date)
  const menuItems: MenuItem[] =
    user?.role === 'developer' ? adminMenuItems : userMenuItems

  // const toggleMenu = (title: string) => {
  //   setOpenMenus([])
  //   setOpenMenus(prev =>
  //     prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
  //   )
  // }
  const toggleMenu = (title: string) => {
    setOpenMenus(prev => {
      if (prev.includes(title)) {
        return prev.filter(t => t !== title)
      }
      return [title]
    })
  }

  useEffect(() => {
    if (openMenus.length) return
    const match = menuItems.find(
      item =>
        item.path === pathname ||
        item.submenu?.some(sub => sub.path === pathname)
    )
    if (!match) return
    const title = match.title as string
    setOpenMenus([title])
  }, [openMenus, menuItems, pathname])

  const isAlwaysActivePath = (path: string | undefined) => {
    if (!path) return false
    const allowedPaths = [
      '/dashboard',
      '/profile',
      '/payment',
      '/subscription',
      '/siteStore'
    ]
    return allowedPaths.some(allowedPath => path.startsWith(allowedPath))
  }

  const isLinkDisabled = (path: string | undefined) => {
    return isExpired && path && !isAlwaysActivePath(path)
  }

  const SidebarContent = () => (
    <div className='flex flex-col h-full font-plusjakarta text-sm '>
      {/* Admin Info */}
      <div className='w-full text-gray-500 dark:text-white py-2 flex gap-2 items-center px-5'>
        <Link to='/profile' className='max-w-full min-w-fit'>
          {/* <img
            // src="https://avatar.iran.liara.run/public"
            src={user.picture?.optimizeUrl || avatar}
            alt='Avatar'
            className='w-12 h-12 rounded-full aspect-square object-cover'
          /> */}
          {user.picture && user.picture?.secure_url !== '' ? (
            <Image
              src={user.picture?.secure_url || avatar}
              // src={'sdfs'}
              alt='Avatar'
              rounded='full'
              objectFit='cover'
              className='w-12 h-12 rounded-full aspect-square object-cover'
            />
          ) : (
            <img
              src={avatar}
              alt='Avatar'
              className='w-12 h-12 rounded-full aspect-square object-cover'
            />
          )}
        </Link>
        <div className='max-w-[75%]'>
          <p className='text-lg font-semibold capitalize truncate'>
            {user?.name}
          </p>

          {!isExpired && remainingTime.text && (
            <p
              className={twMerge(
                'font-medium',
                (() => {
                  // Critical (red) - less than 1 day remaining
                  if (remainingTime.unit === 'days' && remainingTime.value <= 1)
                    return 'text-red-500'
                  if (remainingTime.unit === 'hours') return 'text-red-500'
                  if (remainingTime.unit === 'minutes') return 'text-red-500'

                  // Warning (yellow) - less than 3 days or 12 hours remaining
                  if (remainingTime.unit === 'days' && remainingTime.value <= 3)
                    return 'text-yellow-500'
                  // Normal (green) - more than 3 days remaining
                  return 'text-green-500'
                })()
              )}
            >
              {remainingTime.text}
            </p>
          )}
          {isExpired && <p className='text-red-500'>Expired</p>}
        </div>
      </div>

      {/* Scrollable Menu */}
      <div className='flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 py-4 px-5 space-y-1'>
        {menuItems.map(item => (
          <div key={item.title}>
            {item.submenu ? (
              <>
                <button
                  onClick={() =>
                    !isLinkDisabled(item.path) &&
                    toggleMenu(item.title as string)
                  }
                  className={twMerge(
                    'flex justify-between items-center w-full p-2 rounded hover:bg-orange-100 hover:text-primary dark:hover:text-primary',
                    isLinkDisabled(item.path)
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-600 dark:text-white '
                  )}
                  disabled={isLinkDisabled(item.path) || undefined}
                >
                  <div className='flex items-center gap-2'>
                    {item.icon && <item.icon className='size-4' />}
                    <span>{item.title}</span>
                  </div>
                  {!isLinkDisabled(item.path) &&
                    openMenus.includes(item.title as string) ? (
                    <FaCaretUp />
                  ) : (
                    <FaCaretDown />
                  )}
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openMenus.includes(item.title as string)
                      ? 'auto'
                      : 0,
                    opacity: openMenus.includes(item.title as string) ? 1 : 0
                  }}
                  className='overflow-hidden'
                >
                  <ul className='pl-6 space-y-1 mt-1'>
                    {item.submenu.map((sub, i) => (
                      <li key={i}>
                        <NavLink
                          to={isLinkDisabled(sub.path) ? '#' : sub.path}
                          onClick={e => {
                            if (isLinkDisabled(sub.path)) {
                              e.preventDefault()
                            } else if (!isDesktop) {
                              close()
                            }
                          }}
                          className={({ isActive }) =>
                            twMerge(
                              'block p-2 rounded',
                              isLinkDisabled(sub.path)
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : isActive
                                  ? 'bg-orange-100 text-primary font-semibold'
                                  : 'text-gray-600 dark:text-white hover:bg-orange-100 hover:text-primary  dark:hover:text-primary'
                            )
                          }
                          aria-disabled={
                            isLinkDisabled(sub.path) ? true : undefined
                          }
                          tabIndex={isLinkDisabled(sub.path) ? -1 : undefined}
                        >
                          {sub.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </>
            ) : (
              <NavLink
                to={isLinkDisabled(item.path) ? '#' : item.path!}
                onClick={e => {
                  if (isLinkDisabled(item.path)) {
                    e.preventDefault()
                  } else if (!isDesktop) {
                    close()
                  }
                }}
                className={({ isActive }) =>
                  twMerge(
                    'flex items-center gap-2 p-2 rounded',
                    isLinkDisabled(item.path)
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : isActive
                        ? 'bg-orange-100 text-primary font-semibold '
                        : 'text-gray-600 dark:text-white hover:bg-orange-100 hover:text-primary  dark:hover:text-primary'
                  )
                }
                aria-disabled={isLinkDisabled(item.path) ? true : undefined}
                tabIndex={isLinkDisabled(item.path) ? -1 : undefined}
              >
                {item.icon && <item.icon className='size-4' />}
                {item.title}
              </NavLink>
            )}
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className='p-3  '>
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-2 p-2 rounded  font-medium text-gray-600 dark:text-white hover:bg-orange-100 hover:text-primary  dark:hover:text-primary'
        >
          <MdLogout className='size-4' />
          Sign Out
        </button>
      </div>
    </div>
  )

  const sidebarClasses = 'h-full  w-64 bg-white dark:bg-primary-dark'

  return isDesktop ? (
    <aside ref={sidebarRef} className={sidebarClasses}>
      {SidebarContent()}
    </aside>
  ) : (
    isSidebarOpen && (
      <motion.aside
        ref={sidebarRef}
        className={`${sidebarClasses}`}
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{
          type: 'tween',
          ease: [0.25, 0.1, 0.25, 1],
          duration: 0.5
        }}
      >
        {SidebarContent()}
      </motion.aside>
    )
  )
}
