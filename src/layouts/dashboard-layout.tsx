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

  // Cosmic particle component
  const CosmicParticle = ({
    delay = '0s',
    size = '4px',
    color = 'cyan',
    style = {}
  }: {
    delay?: string;
    size?: string;
    color?: string;
    style?: React.CSSProperties;
  }) => {
    const colorMap = {
      cyan: 'bg-cyan-400',
      purple: 'bg-purple-400',
      blue: 'bg-blue-400'
    };

    return (
      <div
        className={`absolute rounded-full ${colorMap[color as keyof typeof colorMap]} opacity-60 animate-floatParticle pointer-events-none`}
        style={{
          width: size,
          height: size,
          animationDelay: delay,
          animationDuration: '8s',
          ...style,
        }}
      />
    );
  };

  return (
    <div className="relative flex w-full min-h-dvh bg-main dark:bg-black overflow-hidden">
      {/* Cosmic Background with Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />

        {/* Floating Particles */}
        <CosmicParticle delay="0s" size="3px" color="cyan" style={{ top: '10%', left: '10%' }} />
        <CosmicParticle delay="1s" size="2px" color="purple" style={{ top: '20%', left: '80%' }} />
        <CosmicParticle delay="2s" size="4px" color="blue" style={{ top: '30%', left: '20%' }} />
        <CosmicParticle delay="1.5s" size="2px" color="cyan" style={{ top: '40%', left: '90%' }} />
        <CosmicParticle delay="0.5s" size="3px" color="purple" style={{ top: '50%', left: '30%' }} />
        <CosmicParticle delay="3s" size="2px" color="blue" style={{ top: '60%', left: '70%' }} />
        <CosmicParticle delay="2.5s" size="4px" color="cyan" style={{ top: '70%', left: '15%' }} />
        <CosmicParticle delay="0.8s" size="3px" color="purple" style={{ top: '80%', left: '85%' }} />
        <CosmicParticle delay="1.2s" size="2px" color="blue" style={{ top: '85%', left: '40%' }} />
        <CosmicParticle delay="2.2s" size="3px" color="cyan" style={{ top: '15%', left: '60%' }} />

        {/* Subtle Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      </div>

      {/* Sidebar */}

      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <main
        className={`
          w-full max-h-dvh transition-all duration-300 ease-in-out
          ml-[${sidebarMargin}px]
          p-2 scrollbar-none overflow-hidden
        `}
      >

        <Navbar />
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