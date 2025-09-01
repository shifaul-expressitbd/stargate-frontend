export interface SidebarProps {
  handleLogout: () => void;
}

export interface SidebarTogglerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  className?: string;
}

export interface NavMenuItemProps {
  item: {
    title: string;
    path?: string;
    icon?: React.ComponentType<{ className?: string }>;
    submenu?: Array<{ title: string; path: string; icon?: React.ComponentType<{ className?: string }> }>;
  };
  openMenus: string[];
  showLabels: boolean;
  isLinkDisabled: (path?: string) => boolean;
  toggleMenu: (title: string) => void;
  close: () => void;
  isDesktop: boolean;
}
