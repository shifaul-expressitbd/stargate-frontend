import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

// Simple debounce utility function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center" | "auto";
  direction?: "down" | "up" | "auto";
  isDropdownOpen?: boolean;
  onOpenChange?: (isDropdownOpen: boolean) => void;
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange';
  isInsideContainer?: boolean;
  gap?: number;
}

export const Dropdown = ({
  children,
  className = "",
  align = "left",
  direction = 'down',
  isDropdownOpen: isDropdownOpenProp,
  onOpenChange,
  variant = 'default',
  isInsideContainer = false,
  gap = 8,
}: DropdownProps) => {
  const [isDropdownOpenInternal, setIsDropdownOpenInternal] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = isDropdownOpenProp !== undefined;
  const isDropdownOpen = isControlled
    ? isDropdownOpenProp
    : isDropdownOpenInternal;

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    console.log('userBox dropdown toggle:', newState);
    if (newState) {
      console.log('Dropdown opening, looking for trigger...');
    }
    if (!isControlled) setIsDropdownOpenInternal(newState);
    onOpenChange?.(newState);
  };

  const handleClickOutside = () => {
    if (!isControlled) setIsDropdownOpenInternal(false);
    onOpenChange?.(false);
  };

  return (
    <div ref={containerRef} className={twMerge("relative dropdown-container", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...(child.type === DropdownTrigger
              ? { toggleDropdown, setTriggerWidth, isDropdownOpen }
              : {}),
            ...(child.type === DropdownContent
              ? {
                isDropdownOpen,
                align,
                triggerWidth,
                handleClickOutside,
                variant,
                direction,
                containerRef,
                isInsideContainer,
                gap,
              }
              : {}),
          });
        }
        return child;
      })}
    </div>
  );
};

interface DropdownTriggerProps {
  children: React.ReactNode;
  toggleDropdown?: () => void;
  setTriggerWidth?: (width: number) => void;
}

export const DropdownTrigger = ({
  children,
  toggleDropdown,
  setTriggerWidth,
}: DropdownTriggerProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef.current && setTriggerWidth) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [setTriggerWidth]);

  return (
    <div
      ref={triggerRef}
      className="dropdown-trigger cursor-pointer"
      onClick={toggleDropdown}
    >
      {children}
    </div>
  );
};

interface DropdownContentProps {
  children: React.ReactNode;
  isDropdownOpen?: boolean;
  align?: "left" | "right" | "center" | "auto";
  direction?: "down" | "up" | "auto";
  triggerWidth?: number;
  className?: string;
  handleClickOutside?: () => void;
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange';
  containerRef?: React.RefObject<HTMLDivElement>;
  isInsideContainer?: boolean;
  gap?: number;
}

export const DropdownContent = ({
  children,
  isDropdownOpen,
  align = "auto",
  direction = 'auto',
  triggerWidth,
  className = "",
  handleClickOutside,
  variant = 'default',
  containerRef,
  isInsideContainer = false,
  gap = 8,
}: DropdownContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  // --- OPTIMIZATION: Simplified initial state ---
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    transform: '',
    placement: 'bottom-left',
    isVisible: false,
  });
  const contentSizeRef = useRef({ width: 0, height: 0 });
  const [isContentMeasured, setIsContentMeasured] = useState(false);

  // Enhanced position calculation with collision detection
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) {
      console.log('calculatePosition: Missing trigger ref');
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    console.log('Trigger position:', { top: triggerRect.top, left: triggerRect.left, width: triggerRect.width, height: triggerRect.height });
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const minSpaceRequired = 20; // Minimum space from viewport edge
    // Estimated content dimensions if not yet measured
    const estimatedWidth = triggerWidth || 200;
    const estimatedHeight = contentSizeRef.current.height || 200;
    // Calculate available spaces
    const spaceRight = viewportWidth - triggerRect.right;
    const spaceLeft = triggerRect.left;
    const spaceBottom = viewportHeight - triggerRect.bottom;
    const spaceTop = triggerRect.top;
    // Determine optimal position with fallback strategies
    let placement = 'bottom-left';
    let top = 0;
    let left = 0;
    let transform = '';
    // Determine preferred alignment based on align parameter
    const preferredAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : align === 'center' ? 'center' : 'auto';
    const preferredDirection = direction === 'up' ? 'up' : direction === 'down' ? 'down' : 'auto';
    // Determine position based on preferences
    let useLeft = false;
    let useRight = false;
    if (preferredAlign === 'center') {
      // Force center positioning
      useLeft = false;
      useRight = false;
    } else if (preferredAlign === 'left') {
      useLeft = spaceLeft >= estimatedWidth + minSpaceRequired;
    } else if (preferredAlign === 'right') {
      useRight = spaceRight >= estimatedWidth + minSpaceRequired;
    } else {
      // auto mode - prefer right, then left
      useRight = spaceRight >= estimatedWidth + minSpaceRequired;
      useLeft = !useRight && spaceLeft >= estimatedWidth + minSpaceRequired;
    }
    if (useRight) {
      left = triggerRect.right + gap;
      if (preferredDirection === 'up') {
        if (spaceTop >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.bottom - estimatedHeight;
          placement = 'right-top';
        } else if (spaceBottom >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.top;
          placement = 'right-bottom';
        } else {
          top = triggerRect.top - (estimatedHeight - triggerRect.height) / 2;
          placement = 'right-center';
          top = Math.max(minSpaceRequired, Math.min(top, viewportHeight - estimatedHeight - minSpaceRequired));
        }
      } else {
        if (spaceBottom >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.top;
          placement = 'right-bottom';
        } else if (spaceTop >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.bottom - estimatedHeight;
          placement = 'right-top';
        } else {
          top = triggerRect.top - (estimatedHeight - triggerRect.height) / 2;
          placement = 'right-center';
          top = Math.max(minSpaceRequired, Math.min(top, viewportHeight - estimatedHeight - minSpaceRequired));
        }
      }
    } else if (useLeft) {
      left = triggerRect.left - estimatedWidth - gap;
      if (preferredDirection === 'up') {
        if (spaceTop >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.bottom - estimatedHeight;
          placement = 'left-top';
        } else if (spaceBottom >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.top;
          placement = 'left-bottom';
        } else {
          top = triggerRect.top - (estimatedHeight - triggerRect.height) / 2;
          placement = 'left-center';
          top = Math.max(minSpaceRequired, Math.min(top, viewportHeight - estimatedHeight - minSpaceRequired));
        }
      } else {
        if (spaceBottom >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.top;
          placement = 'left-bottom';
        } else if (spaceTop >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.bottom - estimatedHeight;
          placement = 'left-top';
        } else {
          top = triggerRect.top - (estimatedHeight - triggerRect.height) / 2;
          placement = 'left-center';
          top = Math.max(minSpaceRequired, Math.min(top, viewportHeight - estimatedHeight - minSpaceRequired));
        }
      }
    } else {
      // Final fallback: center positioning
      if (preferredAlign === 'center' || preferredAlign === 'auto') {
        if (preferredDirection !== 'up' && spaceBottom >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.bottom + gap;
          left = isInsideContainer ? gap : triggerRect.left + triggerRect.width / 2 - estimatedWidth / 2;
          placement = 'bottom-center';
          if (!isInsideContainer) {
            left = Math.max(minSpaceRequired, Math.min(left, viewportWidth - estimatedWidth - minSpaceRequired));
          } else {
            // For inside containers, ensure we apply gap as minimum padding
            left = Math.max(gap, left);
          }
        } else if (spaceTop >= estimatedHeight + minSpaceRequired) {
          top = triggerRect.top - estimatedHeight - gap;
          left = isInsideContainer ? 0 : triggerRect.left + triggerRect.width / 2 - estimatedWidth / 2;
          placement = 'top-center';
          if (!isInsideContainer) {
            left = Math.max(minSpaceRequired, Math.min(left, viewportWidth - estimatedWidth - minSpaceRequired));
          }
        } else {
          top = triggerRect.top - (estimatedHeight - triggerRect.height) / 2;
          left = isInsideContainer ? 0 : triggerRect.left + triggerRect.width / 2 - estimatedWidth / 2;
          placement = 'center';
          if (!isInsideContainer) {
            left = Math.max(minSpaceRequired, Math.min(left, viewportWidth - estimatedWidth - minSpaceRequired));
            top = Math.max(minSpaceRequired, Math.min(top, viewportHeight - estimatedHeight - minSpaceRequired));
          }
        }
      } else {
        // Use center positioning as default
        top = triggerRect.top - (estimatedHeight - triggerRect.height) / 2;
        left = triggerRect.left + triggerRect.width / 2 - estimatedWidth / 2;
        placement = 'center';
        left = Math.max(minSpaceRequired, Math.min(left, viewportWidth - estimatedWidth - minSpaceRequired));
        top = Math.max(minSpaceRequired, Math.min(top, viewportHeight - estimatedHeight - minSpaceRequired));
        // Calculate transform if position was constrained
        if (!isInsideContainer) {
          const originalLeft = triggerRect.left + triggerRect.width / 2 - estimatedWidth / 2;
          if (left !== originalLeft) {
            const offset = originalLeft - left;
            transform = `translateX(${offset}px)`;
          }
        }
      }
    }

    setPosition({
      top,
      left,
      transform,
      placement,
      isVisible: true,
    });

    console.log('calculatePosition: Success - Placement:', placement, 'Top:', top, 'Left:', left, 'Size:', contentSizeRef.current, 'Measured:', isContentMeasured);

  }, [triggerWidth, gap, isInsideContainer, align, direction]);

  // Debounced position calculation for performance (Window Resize ONLY)
  const debouncedCalculatePosition = useMemo(
    () => debounce(calculatePosition, 100),
    [calculatePosition]
  );

  // --- OPTIMIZATION: Simplified trigger & initial positioning ---
  useEffect(() => {
    if (!isDropdownOpen || !containerRef) {
      setPosition(prev => ({ ...prev, isVisible: false }));
      return;
    }

    // Simply find the trigger element when dropdown opens
    const triggerElement = containerRef.current?.querySelector('.dropdown-trigger') as HTMLElement;
    if (triggerElement) {
      triggerRef.current = triggerElement;
      console.log('Trigger element found:', triggerElement);
    } else {
      console.warn('Trigger element NOT found in container');
    }

  }, [isDropdownOpen, containerRef]);

  // No longer need fallback since we're properly measuring and positioning

  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = () => debouncedCalculatePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [debouncedCalculatePosition]);

  // Measure content size when visible
  useEffect(() => {
    if (isDropdownOpen && contentRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          contentSizeRef.current = { width, height };

          // If this is the first measurement, calculate position and mark as measured
          if (!isContentMeasured && width > 0 && height > 0 && contentRef.current) {
            // Small delay to ensure content is fully painted before calculating position
            setTimeout(() => {
              calculatePosition();
              setIsContentMeasured(true);
            }, 10);
          }
        }
      });
      observer.observe(contentRef.current);
      return () => observer.disconnect();
    } else {
      // Reset measured state when dropdown closes
      setIsContentMeasured(false);
      contentSizeRef.current = { width: 0, height: 0 };
    }
  }, [isDropdownOpen, calculatePosition, isContentMeasured]);

  // Click outside handler
  useEffect(() => {
    const handleClick = (event: Event) => {
      const target = event.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        handleClickOutside?.();
        setPosition(prev => ({ ...prev, isVisible: false }));
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [handleClickOutside, isDropdownOpen]);

  // --- Modified render condition to allow content measurement ---
  if (!isDropdownOpen) return null;

  // Determine flex alignment based on position
  const isAbove = position.placement.includes('top');
  const flexAlignment = isAbove ? 'items-end' : 'items-start';

  const getArrowClasses = (placement: string, variant: string) => {
    const baseArrow = {
      'bottom-left': 'after:absolute after:top-[-6px] after:left-4 after:border-l-6 after:border-r-6 after:border-b-6 after:border-l-transparent after:border-r-transparent',
      'bottom-center': 'after:absolute after:top-[-6px] after:left-1/2 after:ml-[-6px] after:border-l-6 after:border-r-6 after:border-b-6 after:border-l-transparent after:border-r-transparent',
      'bottom-right': 'after:absolute after:top-[-6px] after:right-4 after:border-l-6 after:border-r-6 after:border-b-6 after:border-l-transparent after:border-r-transparent',
      'top-left': 'after:absolute after:bottom-[-6px] after:left-4 after:border-l-6 after:border-r-6 after:border-t-6 after:border-l-transparent after:border-r-transparent',
      'top-center': 'after:absolute after:bottom-[-6px] after:left-1/2 after:ml-[-6px] after:border-l-6 after:border-r-6 after:border-t-6 after:border-l-transparent after:border-r-transparent',
      'top-right': 'after:absolute after:bottom-[-6px] after:right-4 after:border-l-6 after:border-r-6 after:border-t-6 after:border-l-transparent after:border-r-transparent',
      'right-bottom': 'after:absolute after:left-[-6px] after:top-4 after:border-t-6 after:border-b-6 after:border-r-6 after:border-t-transparent after:border-b-transparent',
      'right-top': 'after:absolute after:left-[-6px] after:bottom-4 after:border-t-6 after:border-b-6 after:border-r-6 after:border-t-transparent after:border-b-transparent',
      'left-bottom': 'after:absolute after:right-[-6px] after:top-4 after:border-t-6 after:border-b-6 after:border-l-6 after:border-t-transparent after:border-b-transparent',
      'left-top': 'after:absolute after:right-[-6px] after:bottom-4 after:border-t-6 after:border-b-6 after:border-l-6 after:border-t-transparent after:border-b-transparent',
    };
    const variantArrowColors = {
      default: 'after:border-b-white after:border-t-white after:border-r-white after:border-l-white',
      cosmic: 'after:border-b-purple-400/50 after:border-t-purple-400/50 after:border-r-purple-400/50 after:border-l-purple-400/50',
      toolbox: 'after:border-b-gray-900/90 after:border-t-gray-900/90 after:border-r-gray-900/90 after:border-l-gray-900/90',
      red: 'after:border-b-black/90 after:border-t-black/90 after:border-r-black/90 after:border-l-black/90',
      green: 'after:border-b-black/90 after:border-t-black/90 after:border-r-black/90 after:border-l-black/90',
      blue: 'after:border-b-black/90 after:border-t-black/90 after:border-r-black/90 after:border-l-black/90',
      sage: 'after:border-b-black/90 after:border-t-black/90 after:border-r-black/90 after:border-l-black/90',
      orange: 'after:border-b-black/90 after:border-t-black/90 after:border-r-black/90 after:border-l-black/90',
    };
    return `${baseArrow[placement as keyof typeof baseArrow]} ${variantArrowColors[variant as keyof typeof variantArrowColors]}`;
  };

  const contentClasses = twMerge(
    "fixed z-[99999] rounded-lg shadow-xl transition-none",
    "flex flex-col",
    flexAlignment,
    isInsideContainer ? 'w-full p-2' : 'mx-2 my-1',
    (() => {
      const variantClasses = {
        default: "bg-white text-black dark:bg-black border border-gray-200 dark:border-gray-700 after:border-white",
        cosmic: "bg-black/95 backdrop-blur-sm border border-purple-400/50 rounded-lg shadow-purple-500/30 shadow-lg after:border-purple-400/50",
        toolbox: "bg-gray-900/90 backdrop-blur-sm border border-slate-500/30 shadow-slate-500/30 after:border-gray-900/90",
        red: "bg-black/90 backdrop-blur-sm border border-red-500/30 shadow-red-500/30 after:border-black/90",
        green: "bg-black/90 backdrop-blur-sm border border-green-500/30 shadow-green-500/30 after:border-black/90",
        blue: "bg-black/90 backdrop-blur-sm border border-blue-500/30 shadow-blue-500/30 after:border-black/90",
        sage: "bg-black/90 backdrop-blur-sm border border-green-600/30 shadow-green-600/30 after:border-black/90",
        orange: "bg-black/90 backdrop-blur-sm border border-orange-500/30 shadow-orange-500/30 after:border-black/90",
      }
      return variantClasses[variant]
    })(),
    getArrowClasses(position.placement, variant),
    className,
  );

  // --- Dynamic transform-origin for better animation ---
  const getTransformOrigin = (placement: string) => {
    if (placement.includes('top')) return 'top';
    if (placement.includes('bottom')) return 'bottom';
    if (placement.includes('left')) return 'left';
    if (placement.includes('right')) return 'right';
    return 'center';
  };

  const contentStyle = {
    top: `${position.top}px`,
    left: `${position.left}px`,
    // --- Updated transform-origin based on placement ---
    transformOrigin: getTransformOrigin(position.placement),
    transform: position.transform,
    minWidth: triggerWidth,
    maxWidth: isInsideContainer ? '100vw' : '90vw',
    maxHeight: '80vh',
    overflow: 'auto' as const,
    // --- Ensure animation class is applied ---
    animation: 'dropdownExpand 0.2s ease-out forwards',
    // --- Hide content until measured and positioned ---
    visibility: (isContentMeasured ? 'visible' : 'hidden') as 'visible' | 'hidden',
  };

  const portalTarget = isInsideContainer && containerRef?.current ? containerRef.current : document.body;

  return createPortal(
    <div
      ref={contentRef}
      className={contentClasses}
      style={contentStyle}
      role="listbox"
      aria-expanded={isDropdownOpen}
      tabIndex={-1}
    >
      {children}
    </div>,
    portalTarget
  );
};