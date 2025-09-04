import AdminDashboard from "@/pages/(admin)/AdminDashboard";
import type { IconType } from "react-icons";
import {
  FaBlender,
  FaBookOpen,
  FaBox,
  FaChartLine,
  FaCheckCircle,
  FaCogs,
  FaCreditCard,
  FaDatabase,
  FaList,
  FaRegEnvelope,
  FaShoppingCart,
  FaTachometerAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdLocalGroceryStore, MdOutlinePayments, MdSupportAgent } from "react-icons/md";

// Types
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

// Icon mapping for string-to-component conversion
const iconMap: Record<string, IconType> = {
  FaTachometerAlt: FaTachometerAlt,
  FaUsers: FaUsers,
  FaRegEnvelope: FaRegEnvelope,
  MdOutlinePayments: MdOutlinePayments,
  FaBlender: FaBlender,
  MdSupportAgent: MdSupportAgent,
  FaUser: FaUser,
  FaCreditCard: FaCreditCard,
  FaCheckCircle: FaCheckCircle,
  MdLocalGroceryStore: MdLocalGroceryStore,
  FaBox: FaBox,
  FaShoppingCart: FaShoppingCart,
  FaChartLine: FaChartLine,
  FaCogs: FaCogs,
  FaBookOpen: FaBookOpen,
  FaDatabase: FaDatabase,
  FaList: FaList,
};

// Default admin menu items
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

// Development user menu items - TAGGRS Structure (fallback when no backend data)
export const devUserMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FaTachometerAlt, // Using existing icon for panels-top-left equivalent
  },
  {
    title: "Products",
    path: "/products",
    icon: FaDatabase,
  },
  {
    title: "Documentation",
    path: "/documentation",
    icon: FaBookOpen,
    submenu: [
      {
        title: "Getting Started",
        path: "/documentation/getting-started",
        icon: FaList,
      },
      {
        title: "GTM Templates",
        path: "/documentation/tracking-templates",
        icon: FaBox,
      },
      {
        title: "Trust & Safety",
        path: "/documentation/transparency-center",
        icon: FaCheckCircle,
      },
    ],
  },
  {
    title: "Profile",
    path: "/profile",
    icon: FaUser,
  },
  {
    title: "Support",
    path: "/support",
    icon: MdSupportAgent,
  },
];

// Helper function to get icon component from string
const getIconComponent = (iconName?: string): IconType | undefined => {
  return iconName ? iconMap[iconName] : undefined;
};

// Transform sidebar data from API to MenuItem format
export const transformSidebarData = (sidebarData: unknown): MenuItem[] => {
  if (!sidebarData || !Array.isArray(sidebarData)) {
    return [];
  }

  return (sidebarData as MenuItem[]).map((item) => ({
    title: item.title || "",
    path: item.path,
    icon: typeof item.icon === "string" ? getIconComponent(item.icon) : item.icon,
    element: item.element,
    submenu: item.submenu?.map((sub) => ({
      title: sub.title,
      path: sub.path,
      icon: typeof sub.icon === "string" ? getIconComponent(sub.icon) : sub.icon,
      element: sub.element,
    })),
  }));
};

// Hook to get user menu items
export const useUserMenuItems = () => {
  // In production: use backend data
  if (process.env.NODE_ENV === "production") {
    // Uncomment and implement when backend is ready
    /*
    const { sidebar } = useAuth();
    const menuItems = transformSidebarData(sidebar);
    return menuItems.length > 0 ? menuItems : devUserMenuItems;
    */

    // Fallback for production if backend isn't ready yet
    return devUserMenuItems;
  }

  // In development: use hardcoded menu items
  return devUserMenuItems;
};

// Hook to get admin menu items (if needed)
export const useAdminMenuItems = () => {
  return adminMenuItems;
};
