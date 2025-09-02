import AdminDashboard from "@/pages/(admin)/AdminDashboard";
import type { IconType } from "react-icons";

import {
  FaBlender,
  FaBox,
  FaChartLine,
  FaCheckCircle,
  FaCogs,
  FaCreditCard,
  FaRegEnvelope,
  FaShoppingCart,
  FaTachometerAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdLocalGroceryStore, MdOutlinePayments, MdSupportAgent } from "react-icons/md";

// Define types that match your authSlice exactly
export type SubMenuItem = {
  title: string;
  path: string;
  icon?: string | IconType;
  element?: string;
};

export type MenuItem = {
  title?: string;
  path?: string;
  icon?: string | IconType;
  element?: string | React.ElementType;
  submenu?: SubMenuItem[];
};

export type Sidebar = MenuItem[];

// Default admin menu items (fallback when no sidebar is provided)
export const adminMenuItems: MenuItem[] = [
  {
    title: "Admin Dashboard",
    path: "/admin/dashboard",
    icon: FaTachometerAlt,
    element: AdminDashboard,
  },

  {
    title: "All Users",
    path: "/admin/subscriber/all-users",
    icon: FaUsers,
  },
  {
    title: "All Subscribers",
    path: "/admin/subscriber/all-clients",
    icon: FaRegEnvelope,
  },
  {
    title: "All Payments",
    path: "/admin/subscriber/all-payments",
    icon: MdOutlinePayments,
  },
  // {
  //   title: 'Renewal Request',
  //   path: '/admin/subscriber/renewal-request',
  //   icon: IoGitPullRequestSharp,
  // },
  {
    title: "All Endpoints",
    path: "/admin/subscriber/endpoints",
    icon: FaBlender,
  },
  {
    title: "All Support Tickets",
    path: "/admin/support/tickets",
    icon: MdSupportAgent,
  },
];

// Hardcoded user menu items for development phase
// TODO: In production, these will come from backend via useAuth hook
export const userMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FaTachometerAlt,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: FaUser,
  },
  {
    title: "Payments",
    path: "/payment",
    icon: FaCreditCard,
  },
  {
    title: "Subscription",
    path: "/subscription",
    icon: FaCheckCircle,
  },
  {
    title: "Site Store",
    path: "/siteStore",
    icon: MdLocalGroceryStore,
  },
  {
    title: "Products",
    path: "/products",
    icon: FaBox,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: FaShoppingCart,
  },
  {
    title: "Support",
    path: "/support",
    icon: MdSupportAgent,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: FaChartLine,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: FaCogs,
  },
];

// Helper function to transform sidebar data from API to MenuItem format
export const transformSidebarData = (sidebarData: Sidebar): MenuItem[] => {
  console.log("[DEBUG] transformSidebarData input:", JSON.stringify(sidebarData, null, 2));
  if (!sidebarData || !Array.isArray(sidebarData)) {
    console.log("[DEBUG] transformSidebarData: invalid sidebarData, returning empty array");
    return [];
  }

  const result = sidebarData.map((item: MenuItem) => ({
    title: item.title || "",
    path: item.path,
    icon: typeof item.icon === "string" ? getIconComponent(item.icon) : item.icon,
    element: item.element,
    submenu: item.submenu
      ? item.submenu.map((sub: SubMenuItem) => ({
          title: sub.title,
          path: sub.path,
          icon: typeof sub.icon === "string" ? getIconComponent(sub.icon) : sub.icon,
          element: sub.element,
        }))
      : undefined,
  }));
  console.log("[DEBUG] transformSidebarData output:", JSON.stringify(result, null, 2));
  return result;
};

// Helper function to get icon component from string
const getIconComponent = (iconName?: string): IconType | undefined => {
  if (!iconName) {
    console.log("[DEBUG] getIconComponent: no iconName provided");
    return undefined;
  }

  // Map your icon strings to actual icon components
  const iconMap: Record<string, IconType> = {
    FaTachometerAlt: FaTachometerAlt,
  };

  const icon = iconMap[iconName];
  if (!icon) {
    console.log(`[DEBUG] getIconComponent: icon '${iconName}' not found in iconMap`);
  }
  return icon;
};

// Hook to get user menu items
export const useUserMenuItems = () => {
  // DEVELOPMENT PHASE: Using hardcoded userMenuItems instead of backend data
  // TODO: In production, uncomment the lines below and comment out the return statement
  /*
  const { user, sidebar } = useAuth();
  const menuItems = transformSidebarData(sidebar as Array<MenuItem>);
  return menuItems;
  */

  // For development: return hardcoded menu items
  return userMenuItems;
};
