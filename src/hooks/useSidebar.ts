import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { SidebarMode } from "../lib/features/sidebar/sidebarSlice";
import {
  closeSidebar,
  openSidebar,
  setCollapsed,
  setSidebarMode,
  toggleOpenMenu,
} from "../lib/features/sidebar/sidebarSlice";
import type { RootState } from "../lib/store";
import { getSidebarMode, shouldSidebarBeOpen } from "../utils/sidebarUtils";
import { useResponsive } from "./useResponsive";

/**
 * Custom hook for managing sidebar state and behavior across all devices
 *
 * Features:
 * - Responsive behavior (mobile/tablet/desktop/laptop modes)
 * - Collapsed state management for desktop/laptop
 * - Redux state integration
 * - Performance optimized with useCallback
 *
 * @returns {Object} Sidebar state and control functions
 * @property {boolean} isSidebarOpen - Whether sidebar is currently open
 * @property {boolean} isCollapsed - Whether sidebar is in collapsed state (desktop/laptop only)
 * @property {SidebarMode} currentMode - Current responsive mode ('mobile-overlay' | 'laptop-compact' | 'desktop-expandable')
 * @property {string[]} openMenus - Array of currently expanded menu items
 * @property {Function} open - Manually open the sidebar
 * @property {Function} close - Manually close the sidebar
 * @property {Function} toggle - Toggle sidebar state (device-adaptive behavior)
 * @property {Function} toggleCollapse - Toggle collapsed state (desktop/laptop only)
 * @property {Function} toggleMenu - Toggle expansion of specific menu items
 */
/**
 * Return type for the useSidebar hook
 */
type UseSidebarReturn = {
  readonly isSidebarOpen: boolean;
  readonly isCollapsed: boolean;
  readonly currentMode: SidebarMode;
  readonly openMenus: string[];
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
  readonly toggleCollapse: () => void;
  readonly toggleMenu: (title: string) => void;
};

export const useSidebar = (): UseSidebarReturn => {
  const dispatch = useDispatch();
  const {
    isOpen: isSidebarOpen,
    isCollapsed,
    currentMode,
    openMenus,
  } = useSelector((state: RootState) => state.sidebar);

  const [isManualToggle, setIsManualToggle] = useState(false);
  const modeChangeTimeout = useRef<NodeJS.Timeout | null>(null);
  const autoAdjustTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isManualAdjusting, setIsManualAdjusting] = useState(false);
  const lastToggleTime = useRef<number>(0);
  const isInitialMount = useRef(true);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (modeChangeTimeout.current) {
        clearTimeout(modeChangeTimeout.current);
      }
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
      }
    };
  }, []);

  // Use centralized responsive context
  const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();

  // Memoize shouldSidebarBeOpen computation
  const shouldSidebarBeOpenValue = useMemo(
    () => shouldSidebarBeOpen({ isMobile }),
    [isMobile]
  );

  // Initialize sidebar mode with debouncing
  useEffect(() => {
    const mode = getSidebarMode({ isMobile, isTablet, isLaptop, isDesktop });
    if (currentMode !== mode) {
      if (modeChangeTimeout.current) {
        clearTimeout(modeChangeTimeout.current);
      }
      modeChangeTimeout.current = setTimeout(() => {
        dispatch(setSidebarMode(mode));
      }, 100);
    }
  }, [isMobile, isTablet, isLaptop, isDesktop, dispatch, currentMode]);

  // Handle sidebar state based on device
  useEffect(() => {
    // Skip auto-adjust during initial mount and manual adjustments
    if (isInitialMount.current || isManualAdjusting || isManualToggle) {
      isInitialMount.current = false;
      return;
    }

    if (isSidebarOpen !== shouldSidebarBeOpenValue) {
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
      }
      autoAdjustTimeout.current = setTimeout(() => {
        dispatch(shouldSidebarBeOpenValue ? openSidebar() : closeSidebar());
      }, 100);
    } else {
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
        autoAdjustTimeout.current = null;
      }
    }
  }, [
    shouldSidebarBeOpenValue,
    isSidebarOpen,
    dispatch,
    isManualAdjusting,
    isManualToggle
  ]);

  // Handle collapse state for desktop and laptop from localStorage
  useEffect(() => {
    if ((isDesktop || isLaptop) && typeof window !== "undefined") {
      const savedCollapsed = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsed !== null) {
        dispatch(setCollapsed(JSON.parse(savedCollapsed)));
      }
    }
  }, [isDesktop, isLaptop, dispatch]);

  // Note: Desktop/laptop modes now default to open state
  // Toggle functions ensure collapse rather than close behavior

  // Set isCollapsed based on current mode
  useEffect(() => {
    if (isManualAdjusting) return;
    if (currentMode === "mobile-overlay") {
      dispatch(setCollapsed(false));
    } else if (currentMode === "desktop-expandable") {
      dispatch(setCollapsed(false));
    } else if (currentMode === "laptop-compact") {
      const savedCollapsed = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsed !== null) {
        dispatch(setCollapsed(JSON.parse(savedCollapsed)));
      } else {
        dispatch(setCollapsed(true));
      }
    }
  }, [currentMode, dispatch, isManualAdjusting]);

  /**
   * Opens the sidebar with manual adjustment tracking
   */
  const open = useCallback(() => {
    setIsManualToggle(true);
    setIsManualAdjusting(true);
    lastToggleTime.current = Date.now();
    dispatch(openSidebar());
    setTimeout(() => {
      setIsManualAdjusting(false);
    }, 500);
  }, [dispatch]);

  /**
   * Closes the sidebar with manual adjustment tracking
   */
  const close = useCallback(() => {
    setIsManualToggle(true);
    setIsManualAdjusting(true);
    lastToggleTime.current = Date.now();
    dispatch(closeSidebar());
    setTimeout(() => {
      setIsManualAdjusting(false);
    }, 500);
  }, [dispatch]);

  /**
   * Toggles sidebar state based on device type and current state
   * Desktop/Laptop: Toggles collapsed state while keeping sidebar open
   * Mobile/Tablet: Toggles between open/closed states
   */
  const toggle = useCallback(() => {
    setIsManualToggle(true);
    setIsManualAdjusting(true);
    lastToggleTime.current = Date.now();

    if (isDesktop || isLaptop) {
      // Desktop/laptop: Toggle collapsed state while ensuring sidebar stays open
      const newCollapsed = !isCollapsed;
      dispatch(setCollapsed(newCollapsed));
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsed));

      // Force sidebar to stay open (collapse, don't close the sidebar)
      dispatch(openSidebar());
    } else {
      // Mobile/tablet: Simple open/close logic
      dispatch(isSidebarOpen ? closeSidebar() : openSidebar());
    }

    setTimeout(() => {
      setIsManualAdjusting(false);
    }, 500);
  }, [isDesktop, isLaptop, isCollapsed, dispatch, isSidebarOpen]);

  /**
   * Toggles the collapsed state of the sidebar
   * Only works on desktop/laptop devices; disabled on mobile/tablet
   * Always ensures the sidebar remains open (collapse, don't close)
   */
  const toggleCollapse = useCallback(() => {
    if (currentMode === "mobile-overlay") return;

    if (isDesktop || isLaptop) {
      const newCollapsed = !isCollapsed;
      setIsManualToggle(true);
      setIsManualAdjusting(true);
      lastToggleTime.current = Date.now();
      dispatch(setCollapsed(newCollapsed));
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsed));

      // Desktop/laptop modes: Always ensure sidebar stays open (collapse, don't close)
      dispatch(openSidebar());

      setTimeout(() => {
        setIsManualAdjusting(false);
      }, 500);
    }
  }, [currentMode, isDesktop, isLaptop, isCollapsed, dispatch]);

  /**
   * Toggles the expansion state of a specific menu item
   * @param title - The title of the menu item to toggle
   */
  const handleToggleMenu = useCallback((title: string) => {
    dispatch(toggleOpenMenu(title));
  }, [dispatch]);

  return {
    // State
    isSidebarOpen,      // boolean: Current open state
    isCollapsed,        // boolean: Current collapsed state (desktop/laptop)
    currentMode,        // SidebarMode: Active responsive mode
    openMenus,          // string[]: Currently expanded menu items

    // Actions
    open,               // (): Opens sidebar manually
    close,              // (): Closes sidebar manually
    toggle,             // (): Toggles sidebar (device-adaptive)
    toggleCollapse,     // (): Toggles collapsed state (desktop/laptop)
    toggleMenu: handleToggleMenu, // (title: string): Toggles menu expansion
  } as const;
};