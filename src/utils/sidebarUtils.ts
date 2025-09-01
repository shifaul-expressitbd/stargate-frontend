import type { SidebarMode } from "@/lib/features/sidebar/sidebarSlice";

export const getSidebarMode = ({
  isMobile,
  isTablet,
  isLaptop,
  isDesktop,
}: {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
}): SidebarMode => {
  if (isMobile) return "mobile-overlay";
  if (isTablet) return "tablet-icon-only";
  if (isLaptop) return "laptop-compact";
  if (isDesktop) return "desktop-full";

  // Fallback for edge cases
  return "desktop-full";
};

export const shouldSidebarBeOpen = ({
  isDesktop,
  isMobile,
  isManualToggle,
}: {
  isDesktop: boolean;
  isMobile: boolean;
  isManualToggle: boolean;
}): boolean => {
  if (isManualToggle) return true;
  if (isDesktop) return true;
  return !isMobile;
};

export const getSidebarWidth = (
  isMobile: boolean,
  isTablet: boolean,
  isLaptop: boolean,
  isDesktop: boolean,
  isCollapsed: boolean
): number => {
  if (isMobile) return 320;
  if (isDesktop && isCollapsed) return 72;
  if (isDesktop) return 256;
  if (isLaptop) return 80;
  if (isTablet) return 64;
  return 256; // Fallback
};

export const shouldShowLabels = ({
  currentMode,
  isCollapsed,
}: {
  currentMode: SidebarMode;
  isCollapsed: boolean;
}): boolean => {
  return !isCollapsed || currentMode === "mobile-overlay";
};

export const getTogglerTooltip = ({
  isMobile,
  isDesktop,
  isCollapsed,
  isSidebarOpen,
}: {
  isMobile: boolean;
  isDesktop: boolean;
  isCollapsed: boolean;
  isSidebarOpen: boolean;
}): string => {
  if (isMobile) {
    return isSidebarOpen ? "Close Sidebar" : "Open Sidebar";
  }
  if (isDesktop && isCollapsed) {
    return "Expand Sidebar";
  }
  return isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar";
};

export const isLinkDisabled = ({
  path,
  isExpired,
  alwaysActivePaths = ["/dashboard", "/profile", "/payment", "/subscription", "/siteStore"],
}: {
  path?: string;
  isExpired: boolean;
  alwaysActivePaths?: string[];
}): boolean => {
  if (!path) return false;
  return isExpired && !alwaysActivePaths.some((p) => path.startsWith(p));
};
