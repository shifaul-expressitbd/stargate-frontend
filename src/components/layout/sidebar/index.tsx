import {
  adminMenuItems,
  useUserMenuItems,
  type MenuItem
} from '@/config/routes.config'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/hooks/useSidebar'
import { useSubscription } from '@/hooks/useSubscription'
import type { TUser } from '@/lib/features/auth/authSlice'
import type { SidebarMode } from '@/lib/features/sidebar/sidebarSlice'
import { setOpenMenus } from '@/lib/features/sidebar/sidebarSlice'
import { sidebarRef } from '@/lib/refs'
import { motion } from 'motion/react'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { FaCaretDown, FaCaretUp, FaTimes } from 'react-icons/fa'
import { useMediaQuery } from "react-responsive"
import { Link, NavLink, useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

// Extracted component interfaces and components for better performance
interface SidebarHeaderProps {
  user: UserType;
  isMobile: boolean;
  isSidebarOpen: boolean;
  isCollapsed: boolean;
  showLabels: boolean;
  isExpired: boolean;
  remainingTime: { text: string; unit: string; value: number };
  closeSidebar: () => void;
}

const SidebarHeader = memo(({
  user,
  isMobile,
  isSidebarOpen,
  isCollapsed,
  showLabels,
  isExpired,
  remainingTime,
  closeSidebar
}: SidebarHeaderProps) => (
  <div className={twMerge(
    'border-b border-gray-200 dark:border-gray-700',
    isCollapsed ? 'p-4' : 'px-5 py-4'
  )}>
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

    {/* User Info */}
    {showLabels ? (
      <UserHeaderExpanded user={user} isExpired={isExpired} remainingTime={remainingTime} />
    ) : (
      <UserHeaderCompact user={user} />
    )}
  </div>
));

interface SidebarMenuProps {
  menuItems: MenuItem[];
  isDisabled: (path: string | undefined) => boolean;
  showLabels: boolean;
  openMenus: string[];
}

const SidebarMenu = memo(({
  menuItems,
  isDisabled,
  showLabels,
  openMenus
}: SidebarMenuProps) => (
  <nav
    className={twMerge(
      'flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 py-4 space-y-2',
      showLabels ? 'px-5' : 'px-2'
    )}
    role="navigation"
    aria-label="Main navigation"
  >
    {menuItems.map((item, index) => {
      if (!item.title) {
        // Menu item validation could be handled here if needed
      }
      if (!item.path && !item.submenu) {
        // Menu item validation could be handled here if needed
      }
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
));

interface SidebarFooterProps {
  showLabels: boolean;
  handleLogout: () => void;
}

const SidebarFooter = memo(({
  showLabels,
  handleLogout
}: SidebarFooterProps) => (
  <div className={twMerge(
    'border-t border-gray-200 dark:border-gray-700',
    showLabels ? 'p-3' : 'p-2'
  )}>
    <Tooltip content={!showLabels ? 'Sign Out' : ''}>
      <button
        onClick={handleLogout}
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
));

import Image from '@/components/shared/data-display/image'
import { Tooltip } from '@/components/shared/data-display/tooltip'

import ErrorBoundary from '@/components/ErrorBoundary'
import {
  isLinkDisabled as checkLinkDisabled,
  shouldShowLabels
} from '@/utils/sidebarUtils'
import { MdLogout } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import avatar from '/images/avatar/avatar1.png'

interface SidebarProps {
  handleLogout: () => void
}

const ALWAYS_ACTIVE_PATHS = [
  '/dashboard',
  '/profile',
  '/payment',
  '/subscription',
  '/siteStore'
];

export const Sidebar = memo(({ handleLogout }: SidebarProps) => {
  // COMPUTE RESPONSIVE VALUES DIRECTLY IN COMPONENT - ELIMINATES HOOK EXPENSE
  const mediaQueryOptions = { debounceMs: 50 }; // Throttle to prevent rapid resize events
  const isMobile = useMediaQuery({ query: "(max-width: 767px)", ...mediaQueryOptions });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1279px)", ...mediaQueryOptions });
  const isLaptop = useMediaQuery({ query: "(min-width: 1280px) and (max-width: 1919px)", ...mediaQueryOptions });
  const isDesktop = useMediaQuery({ query: "(min-width: 1920px)", ...mediaQueryOptions });

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const {
    isSidebarOpen,
    isCollapsed,
    openMenus,
    close: closeSidebar
  } = useSidebar();

  // COMPUTE CURRENT MODE LOCALLY - BALANCES RESPONSIVE DESIGN ACCURACY
  const currentMode: SidebarMode = useMemo(() => {
    if (isMobile) return "mobile-overlay";
    if (isTablet) return "tablet-icon-only";
    if (isLaptop) return "laptop-compact";
    if (isDesktop) return "desktop-full";
    return "desktop-full"; // fallback
  }, [isMobile, isTablet, isLaptop, isDesktop]);

  // COMPUTE FINAL RESPONSIVE VALUES - ONLY USED LOCALLY IN SIDEBAR
  const isCollapsedFinal = useMemo(() =>
    currentMode === "laptop-compact" || currentMode === "desktop-full" ? isCollapsed : false,
    [currentMode, isCollapsed]
  );

  const { user } = useAuth();
  const userMenuItems = useUserMenuItems();
  const subscription = useSubscription(user?.warning_date);
  const { isExpired, remainingTime } = subscription;

  // Memoize menu items to prevent unnecessary re-computation
  const menuItems: MenuItem[] = useMemo(() =>
    user?.role === 'developer' ? adminMenuItems : userMenuItems,
    [user?.role, userMenuItems]
  );

  // Memoize showLabels to prevent recalculation
  const showLabels = useMemo(() => shouldShowLabels({
    currentMode,
    isCollapsed
  }), [currentMode, isCollapsed]);

  // Memoize sidebar width class
  const sidebarWidthClass = useMemo(() => {
    switch (currentMode) {
      case 'mobile-overlay':
        return 'w-80'; // 320px
      case 'tablet-icon-only':
        return 'w-64'; // 256px
      case 'laptop-compact':
        return isCollapsed ? 'w-20' : 'w-64'; // Handle collapse/expand for laptop-compact like desktop
      case 'desktop-full':
        return isCollapsed ? 'w-20' : 'w-64'; // Handle collapse within desktop-full
      default:
        return 'w-64';
    }
  }, [currentMode, isCollapsed]);

  // Memoize isDisabled function
  const isDisabled = useCallback((path: string | undefined) =>
    checkLinkDisabled({ path, isExpired, alwaysActivePaths: ALWAYS_ACTIVE_PATHS }),
    [isExpired]
  );

  // Memoize handleLogout for better performance
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


  return (
    <aside
      ref={sidebarRef}
      data-testid="sidebar"
      className={twMerge(
        "min-h-dvh bg-white dark:bg-primary-dark",
        currentMode === 'mobile-overlay' || isTablet ? "fixed inset-y-0 left-0 top-0 z-50 w-fit" : "relative",
        isSidebarOpen ? "block" : "hidden",
      )}
    >

      <div className={twMerge("flex flex-col h-full font-plusjakarta text-sm", sidebarWidthClass)}>
        <SidebarHeader
          user={user}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          isCollapsed={isCollapsedFinal}
          showLabels={showLabels}
          isExpired={isExpired}
          remainingTime={remainingTime}
          closeSidebar={closeSidebar}
        />
        <SidebarMenu
          menuItems={menuItems}
          isDisabled={isDisabled}
          showLabels={showLabels}
          openMenus={openMenus}
        />
        <SidebarFooter
          showLabels={showLabels}
          handleLogout={handleLogoutMemoized}
        />
      </div>

    </aside>
  );
}); // Close memo wrapper

// Helper Components
type UserType = (Partial<TUser> & {
  picture?: {
    public_id: string | null;
    optimizeUrl: string | null;
    secure_url: string | null;
  } | undefined;
}) | null;

interface UserHeaderExpandedProps {
  user: UserType;
  isExpired: boolean;
  remainingTime: { text: string; unit: string; value: number };
}

const UserHeaderExpanded = memo(({
  user,
  isExpired,
  remainingTime
}: UserHeaderExpandedProps) => {
  const statusColorClass = useMemo(() =>
    !isExpired && remainingTime.text ? getStatusColor(remainingTime) : '',
    [isExpired, remainingTime]
  );

  return (
    <div className='w-full text-gray-500 dark:text-white flex gap-3 items-center'>
      <Link to='/profile' className='min-w-fit'>
        {user?.picture?.secure_url ? (
          <Image
            src={user.picture.secure_url}
            alt={`${user?.name || 'User'} profile picture`}
            rounded='full'
            objectFit='cover'
            className='w-10 h-10 rounded-full aspect-square object-cover'
          />
        ) : (
          <img
            src={avatar}
            alt={`${user?.name || 'User'} profile picture`}
            className='w-10 h-10 rounded-full aspect-square object-cover'
          />
        )}
      </Link>
      <div className='max-w-[75%] min-w-0'>
        <p className='text-base font-semibold capitalize truncate'>
          {user?.name}
        </p>
        {!isExpired && remainingTime.text && (
          <p className={statusColorClass}>
            {remainingTime.text}
          </p>
        )}
        {isExpired && <p className='text-red-500 text-xs'>Expired</p>}
      </div>
    </div>
  );
});

interface UserHeaderCompactProps {
  user: UserType;
}

const UserHeaderCompact = memo(({ user }: UserHeaderCompactProps) => (
  <div className='w-full flex justify-center'>
    <Tooltip
      content={user?.name || 'Profile'}
      position="right"
      delay={600}
      showArrow={true}
    >
      <Link to='/profile' className='block'>
        {user?.picture?.secure_url ? (
          <Image
            src={user.picture.secure_url}
            alt={`${user?.name || 'User'} profile picture`}
            rounded='full'
            objectFit='cover'
            className='w-8 h-8 rounded-full aspect-square object-cover transition-transform duration-200 hover:scale-110'
          />
        ) : (
          <img
            src={avatar}
            alt={`${user?.name || 'User'} profile picture`}
            className='w-8 h-8 rounded-full aspect-square object-cover transition-transform duration-200 hover:scale-110'
          />
        )}
      </Link>
    </Tooltip>
  </div>
));

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
  // COMPUTE DESKTOP STATUS LOCALLY - AVOIDS HOOK DEPENDENCY
  const isDesktop = useMediaQuery({ query: "(min-width: 1920px)" });
  const { toggle } = useSidebar();

  if (item.submenu) {
    return (
      <div>
        <MenuButton
          item={item}
          isDisabled={isDisabled}
          showLabels={showLabels}
          isOpen={isOpen}
        />
        <SubMenu
          item={item}
          isDisabled={isDisabled}
          showLabels={showLabels}
          isOpen={isOpen}
        />
      </div>
    );
  }

  return (
    <NavLink
      to={isDisabled(item.path) ? '#' : item.path!}
      onClick={() => !isDisabled(item.path) && !isDesktop && toggle()}
      className={({ isActive }) => getMenuLinkClasses(isActive, isDisabled(item.path), showLabels)}
      aria-disabled={isDisabled(item.path)}
      tabIndex={isDisabled(item.path) ? -1 : undefined}
      aria-label={!showLabels ? (item.title || 'Navigation Item') : undefined}
      title={item.title}
    >
      {item.icon && (
        <Tooltip content={!showLabels ? (item.title || 'Menu Item') : ''}>
          <item.icon className={getIconClasses(isDisabled(item.path), showLabels)} />
        </Tooltip>
      )}
      {showLabels && <span className="font-medium">{item.title}</span>}
    </NavLink>
  );
};

interface MenuButtonProps {
  item: MenuItem;
  isDisabled: (path: string | undefined) => boolean;
  showLabels: boolean;
  isOpen: boolean;
}

const MenuButton = ({
  item,
  isDisabled,
  showLabels,
  isOpen
}: MenuButtonProps) => {
  const { toggleMenu } = useSidebar();

  return (
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
            <item.icon className={getIconClasses(isDisabled(item.path), showLabels)} />
          </Tooltip>
        )}
        {showLabels && <span className="font-medium">{item.title}</span>}
      </div>
      {!isDisabled(item.path) && showLabels && (
        isOpen ? <FaCaretUp className="w-4 h-4 text-gray-400" />
          : <FaCaretDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
};

interface SubMenuProps {
  item: MenuItem;
  isDisabled: (path: string | undefined) => boolean;
  showLabels: boolean;
  isOpen: boolean;
}

const SubMenu = ({
  item,
  isDisabled,
  showLabels,
  isOpen
}: SubMenuProps) => {
  // COMPUTE DESKTOP STATUS LOCALLY - AVOIDS HOOK DEPENDENCY
  const isDesktop = useMediaQuery({ query: "(min-width: 1920px)" });
  const { close } = useSidebar();

  return (
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
              className={({ isActive }) => getSubMenuLinkClasses(isActive, isDisabled(sub.path), showLabels)}
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
  );
};

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

const getIconClasses = (isDisabled: boolean, showLabels: boolean) =>
  twMerge(
    'transition-colors duration-200',
    showLabels ? 'w-5 h-5' : 'w-6 h-6',
    isDisabled
      ? 'text-gray-400 dark:text-gray-500'
      : 'text-gray-500 dark:text-gray-400 group-hover:text-orange-500'
  );

const getMenuLinkClasses = (isActive: boolean, isDisabled: boolean, showLabels: boolean) =>
  twMerge(
    'flex items-center p-3 rounded-lg transition-all duration-200 group relative',
    showLabels ? 'gap-3' : 'flex-col gap-2 justify-center',
    isDisabled
      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
      : isActive
        ? 'bg-orange-100 text-orange-600 font-semibold dark:bg-orange-900 dark:text-orange-300'
        : 'text-gray-600 dark:text-white hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-800'
  );

const getSubMenuLinkClasses = (isActive: boolean, isDisabled: boolean, showLabels: boolean) =>
  twMerge(
    'block p-2 rounded-md transition-all duration-200 text-sm',
    showLabels ? 'pl-6' : 'text-center',
    isDisabled
      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
      : isActive
        ? 'bg-orange-100 text-orange-600 font-semibold dark:bg-orange-900 dark:text-orange-300'
        : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-gray-800'
  );