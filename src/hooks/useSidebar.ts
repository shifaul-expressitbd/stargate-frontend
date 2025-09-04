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
import { getSidebarMode } from "../utils/sidebarUtils";
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

  const modeChangeTimeout = useRef<NodeJS.Timeout | null>(null);
  const autoAdjustTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isManualAdjusting, setIsManualAdjusting] = useState(false);
  const lastToggleTime = useRef<number>(0);
  const isInitialMount = useRef(true);
  const previousMode = useRef<SidebarMode | null>(null);

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

  // Memoize shouldSidebarBeOpen computation - consider both mobile and tablet as small screens
  const shouldSidebarBeOpenValue = useMemo(() => {
    // For small screens (mobile + tablet), default to closed
    if (isMobile || isTablet) {
      return false;
    }
    return true; // Desktop/laptop default to open
  }, [isMobile, isTablet]);

  // Initialize sidebar state properly on first mount based on device type
  useEffect(() => {
    if (isInitialMount.current) {
      previousMode.current = currentMode;
      // Ensure sidebar starts in correct state based on device type
      if (isSidebarOpen !== shouldSidebarBeOpenValue) {
        dispatch(shouldSidebarBeOpenValue ? openSidebar() : closeSidebar());
      }
      // Set mode appropriately based on device
      const correctMode = getSidebarMode({ isMobile, isTablet, isLaptop, isDesktop });
      dispatch(setSidebarMode(correctMode));
      isInitialMount.current = false; // Mark initialization as complete
    }
  }, [currentMode, isMobile, isTablet, isLaptop, isDesktop, dispatch, isSidebarOpen, shouldSidebarBeOpenValue]);

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

  // Handle sidebar state based on device - updated to respect initial state correction
  useEffect(() => {
    // COMPLETELY DISABLE auto-adjust for mobile/tablet - they should respect user actions
    if (isMobile || isTablet) {
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
        autoAdjustTimeout.current = null;
      }
      return;
    }

    // Only run auto-adjust for desktop/laptop devices
    // Skip auto-adjust during manual adjustments
    if (isManualAdjusting || Date.now() - lastToggleTime.current < 1000) {
      return;
    }

    if (isSidebarOpen !== shouldSidebarBeOpenValue) {
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
      }
      autoAdjustTimeout.current = setTimeout(() => {
        dispatch(shouldSidebarBeOpenValue ? openSidebar() : closeSidebar());
      }, 200);
    } else {
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
        autoAdjustTimeout.current = null;
      }
    }
  }, [shouldSidebarBeOpenValue, isSidebarOpen, dispatch, isManualAdjusting, isMobile, isTablet, isInitialMount]);

  // Enhanced transition logic for mode changes with smart state preservation
  useEffect(() => {
    if (isManualAdjusting || isInitialMount.current) return;

    const prevMode = previousMode.current;
    previousMode.current = currentMode;

    // Skip if mode hasn't actually changed
    if (prevMode === currentMode) return;

    let newCollapsed = isCollapsed;
    let newOpen = isSidebarOpen;

    // Handle transitions based on previous mode
    switch (currentMode) {
      case "mobile-overlay":
        // Clean slate for mobile/tablet - reset until user interacts
        newCollapsed = false;
        newOpen = false;
        break;

      case "laptop-compact":
        if (prevMode === "desktop-expandable") {
          // Desktop → Laptop: Always compact for laptop
          newCollapsed = true;
          // Keep open state
        } else if (prevMode === "mobile-overlay") {
          // Mobile/Tablet → Laptop: Start with laptop defaults
          newCollapsed = true;
          newOpen = true; // Laptop should be open by default
        }
        break;

      case "desktop-expandable":
        if (prevMode === "laptop-compact") {
          // Laptop → Desktop: Start expanded, respect user's expanding preference
          newCollapsed = false;
          // Keep open state
        } else if (prevMode === "mobile-overlay") {
          // Mobile/Tablet → Desktop: Start with desktop defaults
          newCollapsed = false;
          newOpen = true; // Desktop should be open by default
        } else {
          // First load or direct transition - check localStorage
          const savedCollapsed = localStorage.getItem("sidebar-collapsed");
          if (savedCollapsed !== null) {
            newCollapsed = JSON.parse(savedCollapsed);
          } else {
            newCollapsed = false;
          }
        }
        break;
    }

    // Apply state changes
    if (newCollapsed !== isCollapsed) {
      dispatch(setCollapsed(newCollapsed));
    }
    if (newOpen !== isSidebarOpen) {
      dispatch(newOpen ? openSidebar() : closeSidebar());
    }
  }, [currentMode, dispatch, isManualAdjusting, isCollapsed, isSidebarOpen]);

  /**
   * Opens the sidebar with manual adjustment tracking
   */
  const open = useCallback(() => {
    setIsManualAdjusting(true);
    lastToggleTime.current = Date.now();
    dispatch(openSidebar());
    setTimeout(() => {
      setIsManualAdjusting(false);
    }, 1000); // Increased to match debounce timing + buffer
  }, [dispatch]);

  /**
   * Closes the sidebar with manual adjustment tracking
   */
  const close = useCallback(() => {
    console.log("useSidebar: close() function triggered");
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
      console.log(
        `useSidebar: toggle() - mobile/tablet - triggering ${isSidebarOpen ? "closeSidebar()" : "openSidebar()"}`
      );
      dispatch(isSidebarOpen ? closeSidebar() : openSidebar());
    }

    // Extended manual toggle duration for mobile/tablet to prevent auto-adjust conflicts
    const resetDelay = isMobile || isTablet ? 2500 : 1000; // 2.5s for mobile/tablet, 1s for others
    setTimeout(() => {
      setIsManualAdjusting(false);
    }, resetDelay);
  }, [isDesktop, isLaptop, isCollapsed, dispatch, isSidebarOpen, isMobile, isTablet]);

  /**
   * Toggles the collapsed state of the sidebar
   * Only works on desktop/laptop devices; disabled on mobile/tablet
   * Always ensures the sidebar remains open (collapse, don't close)
   */
  const toggleCollapse = useCallback(() => {
    if (currentMode === "mobile-overlay") return;

    if (isDesktop || isLaptop) {
      const newCollapsed = !isCollapsed;
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
  const handleToggleMenu = useCallback(
    (title: string) => {
      dispatch(toggleOpenMenu(title));
    },
    [dispatch]
  );

  return {
    // State
    isSidebarOpen, // boolean: Current open state
    isCollapsed, // boolean: Current collapsed state (desktop/laptop)
    currentMode, // SidebarMode: Active responsive mode
    openMenus, // string[]: Currently expanded menu items

    // Actions
    open, // (): Opens sidebar manually
    close, // (): Closes sidebar manually
    toggle, // (): Toggles sidebar (device-adaptive)
    toggleCollapse, // (): Toggles collapsed state (desktop/laptop)
    toggleMenu: handleToggleMenu, // (title: string): Toggles menu expansion
  } as const;
};
