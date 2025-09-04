import ErrorBoundary from '@/components/ErrorBoundary';
import { Tooltip } from '@/components/shared/data-display/tooltip';
import { adminMenuItems, useUserMenuItems, type MenuItem } from '@/config/routes.config';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/useResponsive';
import { useSidebar } from '@/hooks/useSidebar';
import { useSubscription } from '@/hooks/useSubscription';
import useTheme from '@/hooks/useTheme';
import { setOpenMenus } from '@/lib/features/sidebar/sidebarSlice';
import { sidebarRef } from '@/lib/refs';
import { shouldShowLabels } from '@/utils/sidebarUtils';
import { motion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import avatar from '/images/avatar/avatar1.png';


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

export const Sidebar = memo(({ }: SidebarProps) => {
  const { isMobile, isTablet } = useResponsive();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { color } = useTheme();
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
    isCollapsed,
    isMobile,
    isTablet
  }), [currentMode, isCollapsed, isMobile, isTablet]);

  // Memoize sidebar width class
  // const sidebarWidthClass = useMemo(() => {
  //   switch (currentMode) {
  //     case 'mobile-overlay':
  //       return 'w-80';
  //     case 'laptop-compact':
  //       return isCollapsed ? 'w-20' : 'w-64';
  //     case 'desktop-expandable':
  //       return isCollapsed ? 'w-20' : 'w-64';
  //     default:
  //       return 'w-64';
  //   }
  // }, [currentMode, isCollapsed]);

  // Memoize isDisabled function
  const isDisabled = useCallback((path: string | undefined) => {
    if (!path) return true;
    if (ALWAYS_ACTIVE_PATHS.includes(path)) return false;
    if (isExpired) return path !== '/subscription';
    return false;
  }, [isExpired]);

  // Memoize cosmic background decorations
  const cosmicDecorations = useMemo(() => color === 'cosmic' ? (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Subtle Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />

      {/* Glowing Borders */}
      <div className="absolute inset-4 border border-cyan-400/20 rounded-xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute inset-2 border border-purple-400/15 rounded-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />

      {/* Floating Particles */}
      <div className="absolute top-4 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60" style={{ animationDuration: '2s' }} />
      <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
    </div>
  ) : null, [color]);

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
    <>
      <aside
        ref={el => { sidebarRef.current = el; }}
        data-testid="sidebar"
        className={twMerge(
          "min-h-dvh max-h-dvh w-fit backdrop-blur-md relative overflow-hidden",
          color === 'cosmic'
            ? "bg-black/60 border-r border-cyan-400/30"
            : "bg-white dark:bg-primary-dark",
          currentMode === 'mobile-overlay' ? "fixed inset-y-0 left-0 top-0 z-50" : "relative",
          isSidebarOpen ? "block" : "hidden",
          currentMode === 'mobile-overlay' && isSidebarOpen ? "shadow-xl" : ""
        )}
      >
        <div className={twMerge("flex flex-col h-full font-plusjakarta text-sm w-fit",
          // sidebarWidthClass
        )}>
          {/* Header */}
          <div className={twMerge(
            color === 'cosmic'
              ? 'border-b border-cyan-400/30'
              : 'border-b border-gray-200 dark:border-gray-700',
            isCollapsed ? 'p-4' : 'pl-5 py-4'
          )}>
            {/* User Info */}
            {showLabels ? (
              <div className={twMerge(
                'w-full dark:text-white flex gap-3 items-center',
                color === 'cosmic' ? 'text-cyan-200' : 'text-gray-500'
              )}>
                <Link to='/profile' className='min-w-fit'>
                  <img
                    src='/images/logo/logo.png'
                    alt="StarGate"
                    className='w-10 h-10 aspect-square object-cover dark:hidden'
                  />
                  <img
                    src='/images/logo/logo-white.png'
                    alt="StarGate"
                    className='w-10 h-10 aspect-square object-cover hidden dark:block'
                  />
                </Link>
                <div className='max-w-[75%] min-w-0'>
                  <p className='text-3xl leading-10 font-asimovian font-extrabold text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text drop-shadow-[0_0_8px_rgba(138,43,226,0.6)] truncate'>
                    StarGate
                  </p>
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
                      src='/images/logo/logo.png'
                      alt="StarGate"
                      className='w-8 h-8 rounded-full aspect-square object-cover transition-transform duration-200 hover:scale-110 dark:hidden'
                    />
                    <img
                      src='/images/logo/logo-white.png'
                      alt="StarGate"
                      className='w-8 h-8 rounded-full aspect-square object-cover transition-transform duration-200 hover:scale-110 hidden dark:block'
                    />
                  </Link>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Menu */}
          <nav
            className={twMerge(
              'flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400/20 scrollbar-track-gray-100/0 hover:scrollbar-thumb-gray-400 hover:scrollbar-track-gray-100 dark:scrollbar-track-gray-700 py-4 space-y-2',
              showLabels ? 'pl-5' : 'px-2'
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
                    color={color}
                  />
                </ErrorBoundary>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={twMerge(
            color === 'cosmic'
              ? 'border-t border-cyan-400/30'
              : 'border-t border-gray-200 dark:border-gray-700',
            showLabels ? 'p-3' : 'p-2'
          )}>
            {showLabels ? (
              <div className={twMerge(
                'w-full dark:text-white flex gap-3 items-center',
                color === 'cosmic' ? 'text-cyan-200' : 'text-gray-500'
              )}>
                <Link to='/profile' className='min-w-fit'>
                  <img
                    src={avatar}
                    alt={`${user?.name || 'User'} profile picture`}
                    className='w-10 h-10 rounded-full aspect-square object-cover'
                  />
                </Link>
                <div className='max-w-[75%] min-w-0'>
                  <p className='text-lg leading-6 font-semibold capitalize truncate'>
                    {user?.name}
                  </p>
                  {!isExpired && remainingTime.text && (
                    <p className={twMerge(getStatusColor(remainingTime, color), 'text-sm')}>
                      {remainingTime.text}
                    </p>
                  )}
                  {isExpired && (
                    <p className={color === 'cosmic' ? 'text-red-400 text-sm' : 'text-red-500 text-sm'}>
                      Expired
                    </p>
                  )}
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
          </div>
        </div>

        {/* Cosmic Background Decorations */}
        {cosmicDecorations}
      </aside>

      <div className={twMerge('w-screen h-screen', (currentMode === 'mobile-overlay' && isSidebarOpen) ? "fixed inset-y-0 left-0 top-0 z-40" : "relative hidden",)} onClick={() => { closeSidebar() }} />
    </>
  );
});

// Helper Functions
const getStatusColor = (remainingTime: { unit: string; value: number }, color?: string) => {
  const { unit, value } = remainingTime;

  if ((unit === 'days' && value <= 1) || unit === 'hours' || unit === 'minutes') {
    return color === 'cosmic' ? 'text-red-400' : 'text-red-700 dark:text-red-400';
  }
  if (unit === 'days' && value <= 3) {
    return color === 'cosmic' ? 'text-yellow-400' : 'text-yellow-700 dark:text-yellow-400';
  }
  return color === 'cosmic' ? 'text-green-400' : 'text-green-700 dark:text-green-400';
};

interface MenuItemProps {
  item: MenuItem;
  isDisabled: (path: string | undefined) => boolean;
  showLabels: boolean;
  isOpen: boolean;
  color: string;
}

const MenuItem = memo(({
  item,
  isDisabled,
  showLabels,
  isOpen,
  color
}: MenuItemProps) => {
  const { toggle, toggleMenu, close } = useSidebar();
  const isDesktop = useMemo(() => window.innerWidth >= 1920, []);

  if (item.submenu) {
    return (
      <div>
        <button
          onClick={() => !isDisabled(item.path) && toggleMenu(item.title as string)}
          className={twMerge(
            'flex items-center justify-between w-full p-3  transition-all duration-200 group',
            showLabels ? 'gap-3 rounded-l-lg' : 'flex-col gap-2 justify-center rounded-lg',
            isDisabled(item.path)
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
              : color === 'cosmic'
                ? 'text-cyan-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600'
                : 'text-gray-600 dark:text-white hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-800'
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
                    : color === 'cosmic'
                      ? 'text-gray-500 dark:text-gray-400 group-hover:text-cyan-500'
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
                  onClick={() => {
                    if (!isDisabled(sub.path) && !isDesktop) {
                      console.log('sidebar: Submenu NavLink clicked, calling close()');
                      close();
                    }
                  }}
                  className={({ isActive }) => twMerge(
                    'block p-2 rounded-l-md transition-all duration-200 text-sm',
                    showLabels ? 'pl-6' : 'text-center',
                    isDisabled(sub.path)
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                      : isActive
                        ? color === 'cosmic'
                          ? 'bg-cyan-100 text-cyan-600 font-semibold dark:bg-cyan-900 dark:text-cyan-300'
                          : 'bg-orange-100 text-orange-600 font-semibold dark:bg-orange-900 dark:text-orange-300'
                        : color === 'cosmic'
                          ? 'text-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:bg-gray-800 hover:dark:bg-cyan-900/20'
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
      onClick={() => {
        if (!isDisabled(item.path) && !isDesktop) {
          console.log('sidebar: Main NavLink clicked, calling toggle()');
          toggle();
        }
      }}
      className={({ isActive }) => twMerge(
        'flex items-center p-3 transition-all duration-200 group relative',
        showLabels ? 'gap-3 rounded-l-lg' : 'flex-col gap-2 justify-center rounded-lg',
        isDisabled(item.path)
          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
          : isActive
            ? color === 'cosmic'
              ? 'bg-cyan-100 text-cyan-600 font-semibold dark:bg-cyan-900 dark:text-cyan-300'
              : 'bg-orange-100 text-orange-600 font-semibold dark:bg-orange-900 dark:text-orange-300'
            : color === 'cosmic'
              ? 'text-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-900/20'
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
              : color === 'cosmic'
                ? 'text-gray-500 dark:text-gray-400 group-hover:text-cyan-500'
                : 'text-gray-500 dark:text-gray-400 group-hover:text-orange-500'
          )} />
        </Tooltip>
      )}
      {showLabels && <span className="font-medium">{item.title}</span>}
    </NavLink>
  );
});