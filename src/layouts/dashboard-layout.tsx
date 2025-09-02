import { useAuth } from '@/hooks/useAuth'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import Modal from '@/components/shared/modals/modal'
import { useSidebar } from '@/hooks/useSidebar'
import { logout } from '@/lib/features/auth/authSlice'
import { closeSidebar } from '@/lib/features/sidebar/sidebarSlice'
import { useAppDispatch } from '@/lib/hooks'
import { getSidebarWidth } from '@/utils/sidebarUtils'
import { createPortal } from 'react-dom'


export const DashboardLayout = () => {
  const { subscriptionExpired } = useAuth()
  const { isMobile, isTablet, isLaptop, isDesktop, isCollapsed, isSidebarOpen } = useSidebar()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const sidebarMargin = (isMobile || (isTablet && !isSidebarOpen)) ? 0 : getSidebarWidth(isMobile, isTablet, isLaptop, isDesktop, isCollapsed)

  // Modal logic for expired subscription
  const [showModal, setShowModal] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const shouldShowReminder = useMemo(() => ['/profile', '/payment', '/siteStore'].some((path) =>
    location.pathname.startsWith(path)
  ), [location.pathname])

  useEffect(() => {
    if (subscriptionExpired && shouldShowReminder) {
      setShowModal(true)
    } else {
      setShowModal(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [subscriptionExpired, shouldShowReminder, location.pathname])

  const handleCloseModal = () => {
    setShowModal(false)
    if (subscriptionExpired && shouldShowReminder) {
      timeoutRef.current = setTimeout(() => {
        setShowModal(true)
      }, 30_000)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Logout handler
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }



  return (
    <div className="relative flex w-full min-h-dvh bg-main dark:bg-black overflow-hidden">
      {/* Sidebar */}

      <Sidebar handleLogout={handleLogout} />

      {/* Backdrop for mobile and tablet */}
      {(isMobile || isTablet) && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          w-full transition-all duration-300 ease-in-out
          ml-[${sidebarMargin}px]
          p-2 scrollbar-thin
        `}
      >

        <Navbar handleLogout={handleLogout} />

        <Outlet />
      </main>

      {/* Subscription Expired Modal (Portal) */}
      {subscriptionExpired &&
        createPortal(
          <Modal
            isModalOpen={showModal}
            onClose={handleCloseModal}
            title="Subscription Expired"
            showFooter={false}
            size="md"
          >
            <div className="p-6 text-black dark:text-white">
              <p className="mb-4">
                Your subscription has expired! Please contact our support team.
                <br />
                <strong>Call: 01779025322</strong>
              </p>
              <button
                onClick={() => (window.location.href = '/subscription')}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
              >
                Renew Now
              </button>
            </div>
          </Modal>,
          document.body
        )}
    </div>
  )
}