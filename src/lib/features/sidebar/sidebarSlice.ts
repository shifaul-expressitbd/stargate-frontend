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
 */
const initialState: SidebarState = {
  isOpen: true,                    // Desktop/laptop default to open
  isCollapsed: false,             // Desktop/laptop default to expanded
  currentMode: "desktop-expandable", // Default mode for most development environments
  openMenus: [],                  // No menus expanded by default
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
