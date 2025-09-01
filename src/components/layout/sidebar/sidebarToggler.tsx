import { useSidebar } from '@/hooks/useSidebar';
import { getTogglerTooltip } from '@/utils/sidebarUtils';
import { AnimatePresence, motion } from 'motion/react';
import {
  HiBars3,
  HiBarsArrowDown,
  HiBarsArrowUp,
  HiMiniBars3CenterLeft,
  HiXMark
} from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';

interface SidebarTogglerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export const SidebarToggler = ({
  size = 'md',
  variant = 'default',
  className
}: SidebarTogglerProps) => {
  const {
    isSidebarOpen,
    toggle,
    isMobile,
    isCollapsed,
    toggleCollapse,
    isDesktop
  } = useSidebar();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const variantClasses = {
    default: 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm',
    ghost: 'hover:bg-gray-100',
    outline: 'border border-gray-300 hover:bg-gray-50'
  };

  const getIcon = () => {
    if (isMobile) return isSidebarOpen ? HiXMark : HiBars3;
    if (isDesktop) {
      if (isCollapsed) return HiBarsArrowDown;
      if (isSidebarOpen) return HiBarsArrowUp;
      return HiBars3;
    }
    return isSidebarOpen ? HiMiniBars3CenterLeft : HiBars3;
  };

  const handleClick = () => {
    if (isMobile) {
      toggle();
      return;
    }

    if (isDesktop) {
      if (isCollapsed || !isSidebarOpen) {
        toggle();
      } else {
        toggleCollapse();
      }
      return;
    }

    toggle();
  };

  const IconComponent = getIcon();
  const tooltip = getTogglerTooltip({ isMobile, isDesktop, isCollapsed, isSidebarOpen });

  return (
    <button
      id='sidebar-toggler'
      title={tooltip}
      aria-label={tooltip}
      onClick={handleClick}
      className={twMerge(
        'relative flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={`${isSidebarOpen}-${isCollapsed}`}
          initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <IconComponent className={twMerge(
            'text-gray-700 transition-colors duration-200',
            iconSizes[size]
          )} />
        </motion.div>
      </AnimatePresence>

      {!isMobile && (
        <div className="absolute inset-0 rounded-lg bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200" />
      )}
    </button>
  );
};