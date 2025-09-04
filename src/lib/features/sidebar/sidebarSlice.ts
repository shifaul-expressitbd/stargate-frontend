import { createSlice } from "@reduxjs/toolkit";

/**
 * Available sidebar modes based on device type and user preference
 * - `mobile-overlay`: Full overlay mode for mobile/tablet devices
 * - `laptop-compact`: Narrow collapsed mode optimized for laptop screens
 * - `desktop-expandable`: Wide expanded mode for desktop screens (> 1920px)
 */
export type SidebarMode = "mobile-overlay" | "laptop-compact" | "desktop-expandable";

/**
 * Redux state structure for the sidebar feature
 */
interface SidebarState {
  /** Whether the sidebar is currently visible on screen */
  isOpen: boolean;
  /** Whether the sidebar is in collapsed (narrow) state - desktop/laptop only */
  isCollapsed: boolean;
  /** Current responsive mode of the sidebar */
  currentMode: SidebarMode;
  /** Array of menu item titles that are currently expanded */
  openMenus: string[];
}

/**
 * Default initial state for the sidebar redux slice
 * Note: isOpen defaults to false to ensure mobile/tablet start closed
 * The useSidebar hook will determine the correct state on mount
 */
const initialState: SidebarState = {
  isOpen: false, // Default to false - ensures mobile/tablet start closed
  isCollapsed: false, // Desktop/laptop default to expanded
  currentMode: "mobile-overlay", // Default to mobile-overlay for most device types
  openMenus: [], // No menus expanded by default
};

/**
 * Redux slice for managing sidebar state and behavior across all devices
 * Handles responsive behavior, collapse state, and menu expansions
 */
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    toggleCollapsed: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
    setSidebarMode: (state, action) => {
      state.currentMode = action.payload;
    },
    toggleOpenMenu: (state, action) => {
      const title = action.payload;
      if (state.openMenus.includes(title)) {
        state.openMenus = state.openMenus.filter((t) => t !== title);
      } else {
        state.openMenus = [title]; // Only one open at a time
      }
    },
    setOpenMenus: (state, action) => {
      state.openMenus = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleCollapsed,
  setCollapsed,
  setSidebarMode,
  toggleOpenMenu,
  setOpenMenus,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
