import { createSlice } from "@reduxjs/toolkit";

export type SidebarMode = "mobile-overlay" | "tablet-icon-only" | "laptop-compact" | "desktop-full";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean; // For desktop collapse mode
  currentMode: SidebarMode;
  openMenus: string[]; // Menu items that are expanded
}

const initialState: SidebarState = {
  isOpen: true,
  isCollapsed: false,
  currentMode: "desktop-full",
  openMenus: [],
};

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
