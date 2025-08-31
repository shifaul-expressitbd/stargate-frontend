
import { useAuth } from '@/hooks/useAuth'
import { navbarRef, sidebarRef } from '@/lib/refs'
import {
  motion,
  type AnimationGeneratorType,
  type Easing
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/shared/buttons/button'
import Modal from '@/components/shared/modals/modal'
import { useSidebar } from '@/hooks/useSidebar'
import { logout } from '@/lib/features/auth/authSlice'
import { useAppDispatch } from '@/lib/hooks'
const transitionConfig = {
  type: 'tween' as AnimationGeneratorType,
  ease: 'easeInOut' as Easing,
  duration: 0.3
}

export const DashboardLayout = () => {
  const { subscriptionExpired } = useAuth()
  // console.log(subscriptionExpired)
  const { isSidebarOpen, isDesktop } = useSidebar()
  const navbarHeight = navbarRef.current?.offsetHeight || 0
  const sidebarWidth = sidebarRef.current?.offsetWidth || 0
  const [isSidebarAnimating, setIsSidebarAnimating] = useState(false)
  const location = useLocation()

  const reminderRoutes = ['/profile', '/payment', '/siteStore']
  const onReminderRoute = reminderRoutes.some(p =>
    location.pathname.startsWith(p)
  )
  const [showModal, setShowModal] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (subscriptionExpired && onReminderRoute) {
      setShowModal(true)
    } else {
      setShowModal(false)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [subscriptionExpired, onReminderRoute])

  const handleClose = () => {
    setShowModal(false)
    if (subscriptionExpired && onReminderRoute) {
      timeoutRef.current = setTimeout(() => {
        setShowModal(true)
      }, 30_000)
    }
  }
  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])
  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarAnimating(true)
    }
  }, [isSidebarOpen])
  const [layoutStyles, setLayoutStyles] = useState({
    navbar: {
      width: '100vw',
      transform: 'translateX(0)'
    },
    sidebar: {
      height: '100vh',
      top: '0',
      bottom: 'auto'
    },
    content: {
      width: `calc(100vw - 64rem)`,
      height: '100svh',
      top: navbarHeight,
      left: 0
    },
    navbarHeight: navbarHeight,
    sidebarWidth: sidebarWidth
  })

  useEffect(() => {
    const updateLayout = () => {
      if (!navbarRef.current || !sidebarRef.current) return

      if (isDesktop) {
        setLayoutStyles({
          navbar: {
            width: `calc(100vw - ${isSidebarOpen ? sidebarWidth : 0}px)`,
            transform: `translateX(${isSidebarOpen ? sidebarWidth : 0}px)`
          },
          sidebar: {
            height: '100dvh',
            top: '0',
            bottom: 'auto'
          },
          content: {
            width: `calc(100vw - ${isSidebarOpen ? sidebarWidth : 0}px)`,
            height: `calc(100svh - ${navbarHeight}px)`,
            top: navbarHeight,
            left: isSidebarOpen ? sidebarWidth : 0
          },
          navbarHeight,
          sidebarWidth
        })
      } else {
        setLayoutStyles({
          navbar: {
            width: '100vw',
            transform: 'translateX(0)'
          },
          sidebar: {
            height: `calc(100dvh - ${navbarHeight}px)`,
            top: 'auto',
            bottom: '0'
          },
          content: {
            width: '100vw',
            height: `calc(100svh - ${navbarHeight}px)`,
            top: navbarHeight,
            left: 0
          },
          navbarHeight,
          sidebarWidth
        })
      }
    }

    updateLayout()
    const resizeObserver = new ResizeObserver(updateLayout)
    if (sidebarRef.current) resizeObserver.observe(sidebarRef.current)
    if (navbarRef.current) resizeObserver.observe(navbarRef.current)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateLayout)
    }
  }, [isSidebarOpen, isDesktop, sidebarWidth, navbarHeight])

  const handleLogout = () => {
    dispatch(logout())
    // cleanupMemory()
    // navigate('/dashboard', { replace: true })
    navigate('/login', { replace: true })
    window.location.reload()
    close()
  }
  return (
    <div className='relative min-h-dvh bg-main dark:bg-black overflow-hidden'>
      {/* Responsive sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isSidebarOpen || !isDesktop ? 0 : '-100%'
        }}
        transition={transitionConfig}
        className='fixed left-0 z-50 bg-transparent'
        style={{
          ...layoutStyles.sidebar,
          willChange: 'transform'
        }}
      >
        <Sidebar handleLogout={handleLogout} />
      </motion.div>

      {/* Main content area */}
      <motion.div
        ref={navbarRef}
        className='fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-primary-dark  transition-colors duration-300'
        initial={false}
        animate={isSidebarAnimating ? layoutStyles.navbar : false}
        transition={transitionConfig}
        style={{
          ...layoutStyles.navbar,
          willChange: 'transform'
        }}
      >
        <Navbar handleLogout={handleLogout} />
      </motion.div>

      <div className='relative flex flex-col w-svw'>
        {/* Animated content container */}
        <motion.div
          className='absolute w-full p-2 overflow-y-scroll scrollbar-thin'
          initial={false}
          animate={isSidebarAnimating ? layoutStyles.content : false}
          style={{
            ...layoutStyles.content,
            top: navbarHeight,
            willChange: 'transform'
          }}
          transition={transitionConfig}
        >
          <div className='relative w-full'>
            {/* {!['/POS', '/pos'].some((path) =>
              location.pathname.includes(path)
            ) && (
              <>
                {typeof window !== 'undefined' &&
                  document.body &&
                  createPortal(
                    <div className="fixed bottom-0 right-0 z-50">
                      <ChatBox />
                    </div>,
                    document.body
                  )}
              </>
            )} */}
            <Outlet />
          </div>
        </motion.div>
      </div>
      {subscriptionExpired && (
        <Modal
          isModalOpen={showModal}
          onClose={handleClose}
          title='Subscription Expired'
          showFooter={false}
          size='md'
        >
          <div className='p-6'>
            <p className='mb-4 text-black dark:text-white'>
              Your subscription has expired! Please Contact Our Support Team.
              Call: 01779025322
            </p>
            <Button
              title='renew'
              variant='ghost'
              className='px-4 py-2 bg-primary text-white rounded'
              onClick={() => (window.location.href = '/subscription')}
            >
              Renew Now
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
