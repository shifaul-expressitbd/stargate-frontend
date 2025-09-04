import ErrorBoundary from '@/components/ErrorBoundary';
import { Tooltip } from '@/components/shared/data-display/tooltip';
import { adminMenuItems, useUserMenuItems, type MenuItem } from '@/config/routes.config';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/useResponsive';
import { useSidebar } from '@/hooks/useSidebar';
import { useSubscription } from '@/hooks/useSubscription';
import { setOpenMenus } from '@/lib/features/sidebar/sidebarSlice';
import { sidebarRef } from '@/lib/refs';
import { shouldShowLabels } from '@/utils/sidebarUtils';
import { motion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { FaCaretDown, FaCaretUp, FaTimes } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import avatar from '/images/avatar/avatar1.png';

// Create ref outside component


const ALWAYS_ACTIVE_PATHS = [
  '/dashboard',
  '/profile',
  '/payment',
  '/subscription',
  '/siteStore'
];



interface SidebarProps {
  handleLogout: () => void;
}

export const Sidebar = memo(({ handleLogout }: SidebarProps) => {
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const {
    isSidebarOpen,
    isCollapsed,
    currentMode,
    openMenus,
    close: closeSidebar
  } = useSidebar();

  // currentMode is now handled centrally by useSidebar hook
  // Remove duplicate mode determination logic

  const { user } = useAuth();
  const userMenuItems = useUserMenuItems();
  const subscription = useSubscription(user?.warning_date);
  const { isExpired, remainingTime } = subscription;

  // Memoize menu items
  const menuItems = useMemo(() =>
    user?.role === 'developer' ? adminMenuItems : userMenuItems,
    [user?.role, userMenuItems]
  );

  // Memoize showLabels
  const showLabels = useMemo(() => shouldShowLabels({
    currentMode,
    isCollapsed
  }), [currentMode, isCollapsed]);

  // Memoize sidebar width class
  const sidebarWidthClass = useMemo(() => {
    switch (currentMode) {
      case 'mobile-overlay':
        return 'w-80';
      case 'laptop-compact':
        return isCollapsed ? 'w-20' : 'w-64';
      case 'desktop-expandable':
        return isCollapsed ? 'w-20' : 'w-64';
      default:
        return 'w-64';
    }
  }, [currentMode, isCollapsed]);

  // Memoize isDisabled function
  const isDisabled = useCallback((path: string | undefined) => {
    if (!path) return true;
    if (ALWAYS_ACTIVE_PATHS.includes(path)) return false;
    if (isExpired) return path !== '/subscription';
    return false;
  }, [isExpired]);

  // Memoize handleLogout
  const handleLogoutMemoized = useCallback(() => handleLogout(), [handleLogout]);

  // Auto-expand relevant menu on route change
  useEffect(() => {
    if (menuItems.length === 0) return;

    const match = menuItems.find(item =>
      item.path === pathname ||
      item.submenu?.some(sub => sub.path === pathname)
    );

    if (match) {
      dispatch(setOpenMenus([match.title as string]));
    }
  }, [menuItems, pathname, dispatch]);

  // Prevent body scroll and improve mobile experience when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;

      // Prevent body scroll and ensure proper positioning
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      // Clear any timeout for closing animations to prevent conflicts
      const cleanup = () => {
        const storedScrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(storedScrollY || '0') * -1);
      };

      return cleanup;
    }
    return undefined;
  }, [isMobile, isSidebarOpen]);

  return (
    <aside
      ref={el => { sidebarRef.current = el; }}
      data-testid="sidebar"
      className={twMerge(
        "min-h-dvh bg-white dark:bg-primary-dark",
        currentMode === 'mobile-overlay' ? "fixed inset-y-0 left-0 top-0 z-50" : "relative",
        isSidebarOpen ? "block" : "hidden",
        currentMode === 'mobile-overlay' && isSidebarOpen ? "shadow-xl" : ""
      )}
    >
      <div className={twMerge("flex flex-col h-full font-plusjakarta text-sm", sidebarWidthClass)}>
        {/* Header */}
        <div className={twMerge(
          'border-b border-gray-200 dark:border-gray-700',
          isCollapsed ? 'p-4' : 'px-5 py-4'
        )}>
          {/* User Info */}
          {showLabels ? (
            <div className='w-full text-gray-500 dark:text-white flex gap-3 items-center'>
              <Link to='/profile' className='min-w-fit'>

                <img
                  src={avatar}
                  alt={`${user?.name || 'User'} profile picture`}
                  className='w-10 h-10 rounded-full aspect-square object-cover'
                />

              </Link>
              <div className='max-w-[75%] min-w-0'>
                <p className='text-base font-semibold capitalize truncate'>
                  {user?.name}
                </p>
                {!isExpired && remainingTime.text && (
                  <p className={getStatusColor(remainingTime)}>
                    {remainingTime.text}
                  </p>
                )}
                {isExpired && <p className='text-red-500 text-xs'>Expired</p>}
              </div>
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              <Tooltip
                content={user?.name || 'Profile'}
                position="right"
                delay={600}
                showArrow={true}
              >
                <Link to='/profile' className='block'>

                  <img
                    src={avatar}
                    alt={`${user?.name || 'User'} profile picture`}
                    className='w-8 h-8 rounded-full aspect-square object-cover transition-transform duration-200 hover:scale-110'
                  />

                </Link>
              </Tooltip>
            </div>
          )}

          {/* Mobile Close Button */}
          {isMobile && isSidebarOpen && (
            <button
              onClick={closeSidebar}
              className="fixed top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav
          className={twMerge(
            'flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 py-4 space-y-2',
            showLabels ? 'px-5' : 'px-2'
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          {menuItems.map((item, index) => {
            if (!item.title) return null;
            if (!item.path && !item.submenu) return null;

            return (
              <ErrorBoundary key={item.title || `menu-item-${index}`} fallback={<div>Error loading menu item</div>}>
                <MenuItem
                  item={item}
                  isDisabled={isDisabled}
                  showLabels={showLabels}
                  isOpen={openMenus.includes(item.title as string)}
                />
              </ErrorBoundary>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={twMerge(
          'border-t border-gray-200 dark:border-gray-700',
          showLabels ? 'p-3' : 'p-2'
        )}>
          <Tooltip content={!showLabels ? 'Sign Out' : ''}>
            <button
              onClick={handleLogoutMemoized}
              className={twMerge(
                'flex items-center p-3 rounded-lg font-medium transition-all duration-200 group w-full',
                showLabels
                  ? 'gap-3 text-gray-600 dark:text-white hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900'
                  : 'flex-col gap-2 justify-center text-gray-600 dark:text-white hover:bg-red-50 hover:text-red-600',
                'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
              )}
              aria-label="Sign Out"
            >
              <MdLogout className={twMerge(
                'transition-colors duration-200',
                showLabels ? 'w-5 h-5' : 'w-6 h-6',
                'text-gray-500 dark:text-gray-400 group-hover:text-red-500'
              )} />
              {showLabels && <span className='text-nowrap'>Sign Out</span>}
            </button>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
});

// Helper Functions
const getStatusColor = (remainingTime: { unit: string; value: number }) => {
  const { unit, value } = remainingTime;

  if ((unit === 'days' && value <= 1) || unit === 'hours' || unit === 'minutes') {
    return 'text-red-700 dark:text-red-400';
  }
  if (unit === 'days' && value <= 3) {
    return 'text-yellow-700 dark:text-yellow-400';
  }
  return 'text-green-700 dark:text-green-400';
};

interface MenuItemProps {
  item: MenuItem;
  isDisabled: (path: string | undefined) => boolean;
  showLabels: boolean;
  isOpen: boolean;
}

const MenuItem = ({
  item,
  isDisabled,
  showLabels,
  isOpen
}: MenuItemProps) => {
  const { toggle, toggleMenu, close } = useSidebar();
  const isDesktop = useMemo(() => window.innerWidth >= 1920, []);

  if (item.submenu) {
    return (
      <div>
        <button
          onClick={() => !isDisabled(item.path) && toggleMenu(item.title as string)}
          className={twMerge(
            'flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 hover:bg-orange-50 dark:hover:bg-gray-800 group',
            showLabels ? 'gap-3' : 'flex-col gap-2 justify-center',
            isDisabled(item.path)
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
              : 'text-gray-600 dark:text-white hover:text-orange-600'
          )}
          disabled={isDisabled(item.path)}
          aria-expanded={isOpen}
          aria-label={`${item.title || 'Menu'} menu`}
        >
          <div className={twMerge('flex items-center', showLabels ? 'gap-3' : 'flex-col gap-1')}>
            {item.icon && (
              <Tooltip
                content={item.title || 'Menu Item'}
                position={showLabels ? 'top' : 'right'}
                delay={400}
                showArrow={true}
              >
                <item.icon className={twMerge(
                  'transition-colors duration-200',
                  showLabels ? 'w-5 h-5' : 'w-6 h-6',
                  isDisabled(item.path)
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-orange-500'
                )} />
              </Tooltip>
            )}
            {showLabels && <span className="font-medium">{item.title}</span>}
          </div>
          {!isDisabled(item.path) && showLabels && (
            isOpen ? <FaCaretUp className="w-4 h-4 text-gray-400" />
              : <FaCaretDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
            marginTop: isOpen ? '0.5rem' : 0
          }}
          className='overflow-hidden'
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ul className={twMerge('space-y-1', showLabels ? 'pl-8' : 'pl-4')} role="group">
            {item.submenu?.map((sub: MenuItem, i: number) => (
              <li key={i}>
                <NavLink
                  to={isDisabled(sub.path) ? '#' : sub.path!}
                  onClick={() => !isDisabled(sub.path) && !isDesktop && close()}
                  className={({ isActive }) => twMerge(
                    'block p-2 rounded-md transition-all duration-200 text-sm',
                    showLabels ? 'pl-6' : 'text-center',
                    isDisabled(sub.path)
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                      : isActive
                        ? 'bg-orange-100 text-orange-600 font-semibold dark:bg-orange-900 dark:text-orange-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-800'
                  )}
                  aria-disabled={isDisabled(sub.path)}
                  tabIndex={isDisabled(sub.path) ? -1 : undefined}
                  aria-label={!showLabels ? (sub.title || 'Menu Item') : undefined}
                >
                  {showLabels && sub.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    );
  }

  return (
    <NavLink
      to={isDisabled(item.path) ? '#' : item.path!}
      onClick={() => !isDisabled(item.path) && !isDesktop && toggle()}
      className={({ isActive }) => twMerge(
        'flex items-center p-3 rounded-lg transition-all duration-200 group relative',
        showLabels ? 'gap-3' : 'flex-col gap-2 justify-center',
        isDisabled(item.path)
          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
          : isActive
            ? 'bg-orange-100 text-orange-600 font-semibold dark:bg-orange-900 dark:text-orange-300'
            : 'text-gray-600 dark:text-white hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-800'
      )}
      aria-disabled={isDisabled(item.path)}
      tabIndex={isDisabled(item.path) ? -1 : undefined}
      aria-label={!showLabels ? (item.title || 'Navigation Item') : undefined}
      title={item.title}
    >
      {item.icon && (
        <Tooltip content={!showLabels ? (item.title || 'Menu Item') : ''}>
          <item.icon className={twMerge(
            'transition-colors duration-200',
            showLabels ? 'w-5 h-5' : 'w-6 h-6',
            isDisabled(item.path)
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-500 dark:text-gray-400 group-hover:text-orange-500'
          )} />
        </Tooltip>
      )}
      {showLabels && <span className="font-medium">{item.title}</span>}
    </NavLink>
  );
};