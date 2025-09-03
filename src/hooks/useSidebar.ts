import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  closeSidebar,
  openSidebar,
  setCollapsed,
  setSidebarMode,
  toggleOpenMenu,
} from "../lib/features/sidebar/sidebarSlice";
import type { RootState } from "../lib/store";
import { getSidebarMode, shouldSidebarBeOpen } from "../utils/sidebarUtils";

export const useSidebar = () => {
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
  const pendingReset = useRef(false);
  const lastToggleTime = useRef<number>(0);

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

  // INTERNAL USE ONLY: Media queries for hook logic - NOT returned to prevent re-render cascades
  // These are used for internal sidebar behavior calculation only
  const mediaQueryOptions = { debounceMs: 100 }; // Throttled for performance
  const isMobile = useMediaQuery({ query: "(max-width: 767px)", ...mediaQueryOptions });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1279px)", ...mediaQueryOptions });
  const isLaptop = useMediaQuery({ query: "(min-width: 1280px) and (max-width: 1919px)", ...mediaQueryOptions });
  const isDesktop = useMediaQuery({ query: "(min-width: 1920px)", ...mediaQueryOptions });

  // Memoize shouldSidebarBeOpen computation to prevent recalculation
  const shouldSidebarBeOpenValue = useMemo(
    () => shouldSidebarBeOpen({ isDesktop, isMobile, isManualToggle }),
    [isDesktop, isMobile, isManualToggle]
  );

  // Initialize sidebar mode with debouncing to prevent oscillations
  useEffect(() => {
    const mode = getSidebarMode({ isMobile, isTablet, isLaptop, isDesktop });
    if (currentMode !== mode) {
      // Clear any pending update
      if (modeChangeTimeout.current) {
        clearTimeout(modeChangeTimeout.current);
      }

      // Debounce the dispatch by 100ms to prevent rapid oscillations
      modeChangeTimeout.current = setTimeout(() => {
        dispatch(setSidebarMode(mode));
      }, 100);
    }
  }, [isMobile, isTablet, isLaptop, isDesktop, dispatch, currentMode]);

  // Handle sidebar state based on device - optimized with memoized calculation and debounced
  useEffect(() => {
    if (
      isSidebarOpen !== shouldSidebarBeOpenValue &&
      !isManualAdjusting &&
      Date.now() - lastToggleTime.current > 1000
    ) {
      // Clear any pending auto-adjust
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
      }
      // Debounce the dispatch by 100ms to prevent rapid oscillations
      autoAdjustTimeout.current = setTimeout(() => {
        dispatch(shouldSidebarBeOpenValue ? openSidebar() : closeSidebar());
      }, 100);
    } else if (
      isSidebarOpen === shouldSidebarBeOpenValue ||
      isManualAdjusting ||
      Date.now() - lastToggleTime.current <= 1000
    ) {
      // No adjustment needed, clear any pending timeout
      if (autoAdjustTimeout.current) {
        clearTimeout(autoAdjustTimeout.current);
        autoAdjustTimeout.current = null;
      }
    }
  }, [shouldSidebarBeOpenValue, isSidebarOpen, dispatch, isManualAdjusting]);

  // Handle collapse state for desktop and laptop
  useEffect(() => {
    if ((isDesktop || isLaptop) && typeof window !== "undefined") {
      const savedCollapsed = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsed !== null) {
        dispatch(setCollapsed(JSON.parse(savedCollapsed)));
      }
    }
  }, [isDesktop, isLaptop, dispatch]);

  // Reset manual toggle when media queries change to re-enable auto behavior
  useEffect(() => {
    if (!pendingReset.current) {
      pendingReset.current = true;
      setTimeout(() => {
        setIsManualToggle(false);
        pendingReset.current = false;
      }, 200);
    }
  }, [isMobile, isTablet, isLaptop, isDesktop]);

  // Set isCollapsed based on current mode
  useEffect(() => {
    if (isManualAdjusting) return;
    // Always keep collapsed false for mobile and tablet
    if (currentMode === "mobile-overlay" || currentMode === "tablet-icon-only") {
      dispatch(setCollapsed(false));
    }
    // For desktop-full and laptop-compact, allow toggling but default to appropriate state
    else if (currentMode === "desktop-full") {
      dispatch(setCollapsed(false));
    } else if (currentMode === "laptop-compact") {
      // Check localStorage for user preference, default to true (collapsed) if not set
      const savedCollapsed = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsed !== null) {
        dispatch(setCollapsed(JSON.parse(savedCollapsed)));
      } else {
        dispatch(setCollapsed(true)); // Default to collapsed for laptop-compact
      }
    }
  }, [currentMode, dispatch, isManualAdjusting]);

  const open = () => {
    setIsManualToggle(true);
    setIsManualAdjusting(true);
    lastToggleTime.current = Date.now();
    dispatch(openSidebar());
    setTimeout(() => {
      setIsManualAdjusting(false);
    }, 500);
  };

  const close = () => {
    setIsManualToggle(true);
    setIsManualAdjusting(true);
    lastToggleTime.current = Date.now();
    dispatch(closeSidebar());
    setTimeout(() => {
      setIsManualAdjusting(false);
    }, 500);
  };

  const toggle = () => {
    setIsManualToggle(true);
    setIsManualAdjusting(true);
    lastToggleTime.current = Date.now();

    if (isDesktop || isLaptop) {
      if (isCollapsed) {
        // Expand from collapsed state
        dispatch(setCollapsed(false));
        localStorage.setItem("sidebar-collapsed", "false");
      } else {
        // Collapse or close
        dispatch(isSidebarOpen ? setCollapsed(true) : openSidebar());
        localStorage.setItem("sidebar-collapsed", isSidebarOpen ? "true" : "false");
      }
    } else {
      // Mobile/tablet toggle
      dispatch(isSidebarOpen ? closeSidebar() : openSidebar());
    }

    setTimeout(() => {
      setIsManualAdjusting(false);
    }, 500);
  };

  const toggleCollapse = () => {
    if (isDesktop || isLaptop) {
      const newCollapsed = !isCollapsed;
      setIsManualToggle(true);
      setIsManualAdjusting(true);
      lastToggleTime.current = Date.now();
      dispatch(setCollapsed(newCollapsed));
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsed));
      setTimeout(() => {
        setIsManualAdjusting(false);
      }, 500);
    }
  };

  const handleToggleMenu = (title: string) => {
    dispatch(toggleOpenMenu(title));
  };

  // IMPORTANT: No longer return media query values to prevent cascading re-renders
  // Components should compute their own responsive values as needed
  return {
    isSidebarOpen,
    isCollapsed,
    currentMode,
    open,
    close,
    toggle,
    toggleCollapse,
    openMenus,
    toggleMenu: handleToggleMenu,
  };
};
