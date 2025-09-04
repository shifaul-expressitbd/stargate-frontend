import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import Modal from '@/components/shared/modals/modal';
import { useResponsive } from '@/hooks/useResponsive';
import { useSidebar } from '@/hooks/useSidebar';
import { logout, selectSubscriptionExpired } from '@/lib/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createPortal } from 'react-dom';


export const DashboardLayout = memo(() => {
  const subscriptionExpired = useAppSelector(selectSubscriptionExpired)
  const { isSidebarOpen } = useSidebar()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Use centralized responsive context
  const { isMobile, isTablet } = useResponsive();

  // Memoize sidebar margin to prevent dynamic Tailwind class recreation
  const sidebarMargin = useMemo(() =>
    (isMobile || (isTablet && !isSidebarOpen)) ? 0 : 250,
    [isMobile, isTablet, isSidebarOpen]
  );

  // Modal logic for expired subscription
  const [showModal, setShowModal] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const shouldShowReminder = useMemo(() =>
    ['/profile', '/payment', '/siteStore'].some((path) =>
      location.pathname.startsWith(path)
    ),
    [location.pathname]
  )

  // Memoize event handlers
  const handleLogout = useCallback(() => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }, [dispatch, navigate])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    if (subscriptionExpired && shouldShowReminder) {
      timeoutRef.current = setTimeout(() => {
        setShowModal(true)
      }, 30_000)
    }
  }, [subscriptionExpired, shouldShowReminder])

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

  // handleCloseModal is now memoized above

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // handleLogout is now memoized above



  return (
    <div className="relative flex w-full min-h-dvh bg-main dark:bg-black overflow-hidden">
      {/* Sidebar */}

      <Sidebar handleLogout={handleLogout} />

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
}); // Close memo wrapper