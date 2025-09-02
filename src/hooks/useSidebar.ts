import { useEffect, useRef, useState } from "react";
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

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1279px)" });
  const isLaptop = useMediaQuery({ query: "(min-width: 1280px) and (max-width: 1919px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1920px)" });

  const [isManualToggle, setIsManualToggle] = useState(false);
  const modeChangeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Initialize sidebar mode with debouncing to prevent oscillations
  useEffect(() => {
    const mode = getSidebarMode({ isMobile, isTablet, isLaptop, isDesktop });
    console.log("[DEBUG useSidebar] Media queries at change:", {
      isMobile,
      isTablet,
      isLaptop,
      isDesktop,
      windowInnerWidth: window?.innerWidth,
      devicePixelRatio: window?.devicePixelRatio,
      timestamp: new Date().toISOString(),
      previousMode: currentMode,
      newMode: mode,
    });
    if (currentMode !== mode) {
      console.log("[DEBUG useSidebar] Mode change detected:", { from: currentMode, to: mode });

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (modeChangeTimeout.current) {
        clearTimeout(modeChangeTimeout.current);
      }
    };
  }, []);

  // Handle sidebar state based on device
  useEffect(() => {
    const shouldOpen = shouldSidebarBeOpen({
      isDesktop,
      isMobile,
      isManualToggle,
    });

    if (isSidebarOpen !== shouldOpen) {
      dispatch(shouldOpen ? openSidebar() : closeSidebar());
    }
  }, [isDesktop, isMobile, isManualToggle, isSidebarOpen, dispatch]);

  // Handle desktop collapse state
  useEffect(() => {
    if (isDesktop && typeof window !== "undefined") {
      const savedCollapsed = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsed !== null) {
        dispatch(setCollapsed(JSON.parse(savedCollapsed)));
      }
    }
  }, [isDesktop, dispatch]);

  // Set isCollapsed based on current mode
  useEffect(() => {
    if (currentMode === "desktop-full" || currentMode === "tablet-icon-only") {
      dispatch(setCollapsed(false));
    } else {
      dispatch(setCollapsed(true));
    }
  }, [currentMode, dispatch]);

  const open = () => {
    setIsManualToggle(true);
    dispatch(openSidebar());
  };

  const close = () => {
    setIsManualToggle(true);
    dispatch(closeSidebar());
  };

  const toggle = () => {
    setIsManualToggle(true);

    if (isDesktop) {
      if (isCollapsed) {
        // Expand from collapsed state
        dispatch(setCollapsed(false));
        localStorage.setItem("sidebar-collapsed", "false");
      } else {
        // Collapse or close
        dispatch(isSidebarOpen ? setCollapsed(true) : openSidebar());
        localStorage.setItem("sidebar-collapsed", isSidebarOpen ? "true" : "false");
      }
      return;
    }

    // Mobile/tablet toggle
    dispatch(isSidebarOpen ? closeSidebar() : openSidebar());
  };

  const toggleCollapse = () => {
    if (isDesktop) {
      const newCollapsed = !isCollapsed;
      dispatch(setCollapsed(newCollapsed));
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsed));
      setIsManualToggle(true);
    }
  };

  const handleToggleMenu = (title: string) => {
    dispatch(toggleOpenMenu(title));
  };

  return {
    isSidebarOpen,
    isCollapsed,
    currentMode,
    isDesktop,
    isTablet,
    isLaptop,
    isMobile,
    open,
    close,
    toggle,
    toggleCollapse,
    openMenus,
    toggleMenu: handleToggleMenu,
  };
};
