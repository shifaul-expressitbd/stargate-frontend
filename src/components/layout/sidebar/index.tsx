import {
  adminMenuItems,
  useUserMenuItems,
  type MenuItem
} from '@/config/routes.config'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/hooks/useSidebar'
import { useSubscription } from '@/hooks/useSubscription'
import type { TUser } from '@/lib/features/auth/authSlice'
import { setOpenMenus } from '@/lib/features/sidebar/sidebarSlice'
import { sidebarRef } from '@/lib/refs'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { FaCaretDown, FaCaretUp, FaTimes } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import Image from '@/components/shared/data-display/image'
import { Tooltip } from '@/components/shared/data-display/tooltip'
import {
  isLinkDisabled as checkLinkDisabled,
  shouldShowLabels
} from '@/utils/sidebarUtils'
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

export const Sidebar = ({ handleLogout }: SidebarProps) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const {
    isSidebarOpen,
    isCollapsed,
    currentMode,
    isMobile,
    openMenus,
    close: closeSidebar
  } = useSidebar();

  const { user } = useAuth();
  console.log("[DEBUG] Sidebar user:", JSON.stringify(user, null, 2));
  const userMenuItems = useUserMenuItems();
  console.log("[DEBUG] Sidebar userMenuItems:", JSON.stringify(userMenuItems, null, 2));
  const subscription = useSubscription(user?.warning_date);
  const { isExpired, remainingTime } = subscription;
  const menuItems: MenuItem[] = user?.role === 'developer' ? adminMenuItems : userMenuItems;
  console.log("[DEBUG] Sidebar final menuItems:", JSON.stringify(menuItems, null, 2));
  console.log("[DEBUG] Sidebar menuItems length:", menuItems.length);

  // Determine if labels should be visible
  const showLabels = shouldShowLabels({
    currentMode,
    isCollapsed
  });

  // Check if link should be disabled
  const isDisabled = (path: string | undefined) =>
    checkLinkDisabled({ path, isExpired, alwaysActivePaths: ALWAYS_ACTIVE_PATHS });

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

  // Header Section
  const SidebarHeader = () => (
    <div className={twMerge(
      'border-b border-gray-200 dark:border-gray-700',
      isCollapsed ? 'p-4' : 'px-5 py-4'
    )}>
      {/* Mobile Close Button */}
      {isMobile && isSidebarOpen && (
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
  );

  // Menu Section
  const SidebarMenu = () => (
    <nav
      className={twMerge(
        'flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 py-4 space-y-2',
        showLabels ? 'px-5' : 'px-2'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {menuItems.map(item => {
        if (!item.title) {
          console.log("[DEBUG] Sidebar: Menu item has no title", JSON.stringify(item, null, 2));
        }
        if (!item.path && !item.submenu) {
          console.log("[DEBUG] Sidebar: Menu item has no path and no submenu", JSON.stringify(item, null, 2));
        }
        return (
          <MenuItem
            key={item.title || `menu-item-${Math.random()}`}
            item={item}
            isDisabled={isDisabled}
            showLabels={showLabels}
            isOpen={openMenus.includes(item.title as string)}
          />
        );
      })}
    </nav>
  );

  // Footer Section
  const SidebarFooter = () => (
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
  );

  return (
    <aside
      ref={sidebarRef}
      data-testid="sidebar"
      className={twMerge(
        "min-h-dvh bg-white dark:bg-primary-dark",
        isMobile ? "fixed inset-y-0 left-0 top-0 w-3/4 z-50" : "relative"
      )}
    >
      <div className="flex flex-col h-full font-plusjakarta text-sm">
        <SidebarHeader />
        <SidebarMenu />
        <SidebarFooter />
      </div>
    </aside>
  );
};

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

const UserHeaderExpanded = ({
  user,
  isExpired,
  remainingTime
}: UserHeaderExpandedProps) => (
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
        <p className={getStatusColor(remainingTime)}>
          {remainingTime.text}
        </p>
      )}
      {isExpired && <p className='text-red-500 text-xs'>Expired</p>}
    </div>
  </div>
);

interface UserHeaderCompactProps {
  user: UserType;
}

const UserHeaderCompact = ({ user }: UserHeaderCompactProps) => (
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
);

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
  const { toggle, isDesktop } = useSidebar();

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
  const { isDesktop, close } = useSidebar();

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