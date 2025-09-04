/**
 * Determines if the sidebar should be open by default based on device type
 * @param options - Options object containing device type information
 * @param options.isMobile - Whether the current device is mobile sized
 * @returns {boolean} True if sidebar should be open by default, false otherwise
 *
 * @example
 * ```typescript
 * shouldSidebarBeOpen({ isMobile: true });  // returns: false (closed for mobile UX)
 * shouldSidebarBeOpen({ isMobile: false }); // returns: true (open for desktop UX)
 * ```
 */
export const shouldSidebarBeOpen = ({
  isMobile,
}: {
  isMobile: boolean;
}): boolean => {
  // On mobile, default to closed to maximize screen real estate
  if (isMobile) {
    return false;
  }
  // On desktop/laptop, default to open for better accessibility
  return true;
};

/**
 * Determines the appropriate sidebar mode based on device type and screen size
 * @param options - Object containing device type detection booleans
 * @param options.isMobile - Whether screen width ≤ 767px
 * @param options.isTablet - Whether 768px ≤ screen width ≤ 1279px
 * @param options.isLaptop - Whether 1280px ≤ screen width ≤ 1919px
 * @param options.isDesktop - Whether screen width ≥ 1920px
 * @returns {SidebarMode} The appropriate sidebar mode for the device
 *
 * @example
 * ```typescript
 * getSidebarMode({ isMobile: true, isTablet: false, isLaptop: false, isDesktop: false });
 * // returns: "mobile-overlay"
 *
 * getSidebarMode({ isMobile: false, isTablet: false, isLaptop: true, isDesktop: false });
 * // returns: "laptop-compact"
 *
 * getSidebarMode({ isMobile: false, isTablet: false, isLaptop: false, isDesktop: true });
 * // returns: "desktop-expandable"
 * ```
 */
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
}): "mobile-overlay" | "laptop-compact" | "desktop-expandable" => {
  // Mobile and tablet devices use overlay mode (full modal behavior)
  if (isMobile || isTablet) return "mobile-overlay";

  // Laptop devices use compact mode (narrow by default)
  if (isLaptop) return "laptop-compact";

  // Desktop devices use expandable mode (wide by default)
  if (isDesktop) return "desktop-expandable";

  // Fallback for any edge cases
  return "desktop-expandable";
};

/**
 * Determines whether menu item labels should be displayed in the sidebar
 * @param options - Options object containing display context
 * @param options.currentMode - Current sidebar mode ('mobile-overlay', 'laptop-compact', 'desktop-expandable')
 * @param options.isCollapsed - Whether the sidebar is currently in collapsed state
 * @returns {boolean} True if labels should be shown, false for icon-only mode
 *
 * @example
 * ```typescript
 * shouldShowLabels({ currentMode: 'mobile-overlay', isCollapsed: false });
 * // returns: false (mobile overlay never shows labels)
 *
 * shouldShowLabels({ currentMode: 'desktop-expandable', isCollapsed: false });
 * // returns: true (expanded desktop shows labels)
 *
 * shouldShowLabels({ currentMode: 'laptop-compact', isCollapsed: true });
 * // returns: false (collapsed mode hides labels)
 * ```
 */
export const shouldShowLabels = ({
  currentMode,
  isCollapsed,
}: {
  currentMode: string;
  isCollapsed: boolean;
}): boolean => {
  // Mobile overlay mode never shows labels (icon-only for space efficiency)
  if (currentMode === "mobile-overlay") return false;

  // For other modes, show labels only when not collapsed
  return !isCollapsed;
};

/**
 * Generates appropriate tooltip text for the sidebar toggle button
 * @param options - Object containing tooltip context information
 * @param options.isMobile - Whether the device is mobile size
 * @param options.isDesktop - Whether the device is desktop size
 * @param options.isCollapsed - Current collapsed state of the sidebar
 * @param options.isSidebarOpen - Current open state of the sidebar
 * @returns {string} Appropriate tooltip text for the current state
 *
 * @example
 * ```typescript
 * getTogglerTooltip({ isMobile: true, isDesktop: false, isCollapsed: false, isSidebarOpen: false });
 * // returns: "Open sidebar"
 *
 * getTogglerTooltip({ isMobile: false, isDesktop: true, isCollapsed: true, isSidebarOpen: true });
 * // returns: "Expand sidebar"
 *
 * getTogglerTooltip({ isMobile: false, isDesktop: false, isCollapsed: false, isSidebarOpen: true });
 * // returns: "Collapse sidebar"
 * ```
 */
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
  // Mobile: Simple open/close actions
  if (isMobile) {
    return isSidebarOpen ? "Close sidebar" : "Open sidebar";
  }

  // Desktop or collapsed state: Handle expansion/collapse actions
  if (isDesktop || isCollapsed) {
    return isCollapsed
      ? "Expand sidebar"          // Expand when collapsed
      : isSidebarOpen
        ? "Collapse sidebar"       // Collapse when open
        : "Open sidebar";          // Open when closed
  }

  // Default: Handle standard collapse/expand for other devices
  return isSidebarOpen ? "Collapse sidebar" : "Expand sidebar";
};