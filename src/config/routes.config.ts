import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "@/pages/(admin)/AdminDashboard";
import type { IconType } from "react-icons";

import {
  FaBalanceScale,
  FaBlender,
  FaBox,
  FaBullhorn,
  FaChartLine,
  FaCheckCircle,
  FaClipboardCheck,
  FaClipboardList,
  FaCogs,
  FaCreditCard,
  FaExchangeAlt,
  FaFileInvoice,
  FaHistory,
  FaList,
  FaMoneyBillAlt,
  FaPlug,
  FaPlus,
  FaPlusCircle,
  FaRegEnvelope,
  FaRulerCombined,
  FaShoppingCart,
  FaSms,
  FaTachometerAlt,
  FaTags,
  FaTruck,
  FaUser,
  FaUserCog,
  FaUsers,
  FaUserShield,
  FaUserTie,
  FaWarehouse,
} from "react-icons/fa";
import { GiGlowingArtifact, GiHandTruck, GiSevenPointedStar } from "react-icons/gi";
import { IoIosImages, IoIosVideocam } from "react-icons/io";
import { IoGitPullRequestSharp } from "react-icons/io5";
import { MdLocalGroceryStore, MdOutlinePayments, MdOutlinePermMedia, MdSupportAgent } from "react-icons/md";
import { TbArrowsExchange, TbCashRegister, TbTruckDelivery, TbTruckReturn } from "react-icons/tb";

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
    FaUsers: FaUsers,
    IoGitPullRequestSharp: IoGitPullRequestSharp,
    MdOutlinePayments: MdOutlinePayments,
    FaRegEnvelope: FaRegEnvelope,
    FaBlender: FaBlender,
    FaCogs: FaCogs,
    FaChartLine: FaChartLine,
    FaWarehouse: FaWarehouse,
    GiSevenPointedStar: GiSevenPointedStar,
    FaUserShield: FaUserShield,
    FaUserTie: FaUserTie,
    GiHandTruck: GiHandTruck,
    FaRulerCombined: FaRulerCombined,
    FaTags: FaTags,
    FaFileInvoice: FaFileInvoice,
    FaPlug: FaPlug,
    MdOutlinePermMedia: MdOutlinePermMedia,
    IoIosImages: IoIosImages,
    IoIosVideocam: IoIosVideocam,
    FaExchangeAlt: FaExchangeAlt,
    FaBox: FaBox,
    FaPlus: FaPlus,
    FaList: FaList,
    TbCashRegister: TbCashRegister,
    FaShoppingCart: FaShoppingCart,
    FaClipboardCheck: FaClipboardCheck,
    FaClipboardList: FaClipboardList,
    TbTruckDelivery: TbTruckDelivery,
    TbArrowsExchange: TbArrowsExchange,
    FaUser: FaUser,
    FaCreditCard: FaCreditCard,
    FaBullhorn: FaBullhorn,
    FaSms: FaSms,
    FaHistory: FaHistory,
    MdLocalGroceryStore: MdLocalGroceryStore,
    FaUserCog: FaUserCog,
    TbTruckReturn: TbTruckReturn,
    FaBalanceScale: FaBalanceScale,
    FaPlusCircle: FaPlusCircle,
    FaTruck: FaTruck,
    FaCheckCircle: FaCheckCircle,
    MdSupportAgent: MdSupportAgent,
    FaMoneyBillAlt: FaMoneyBillAlt,
    GiGlowingArtifact: GiGlowingArtifact,
  };

  const icon = iconMap[iconName];
  if (!icon) {
    console.log(`[DEBUG] getIconComponent: icon '${iconName}' not found in iconMap`);
  }
  return icon;
};

// Hook to get user menu items
export const useUserMenuItems = () => {
  const { user, sidebar } = useAuth();
  console.log("[DEBUG] useUserMenuItems user:", JSON.stringify(user, null, 2));
  console.log("[DEBUG] useUserMenuItems sidebar:", JSON.stringify(sidebar, null, 2));
  // ts-error-ignore
  const menuItems = transformSidebarData(sidebar as Array<MenuItem>);
  console.log("[DEBUG] useUserMenuItems menuItems after transform:", JSON.stringify(menuItems, null, 2));
  if (
    user.owner_id === "682ad002c20c6404b3e2a884" ||
    user.owner_id === "6829ddabc20c6404b3e2a66b" ||
    user.owner_id === "683aef36d77b9d480817af7e"
  ) {
    console.log("[DEBUG] useUserMenuItems: Applying custom logic for owner_id:", user.owner_id);
    const concatedMenu = [
      ...menuItems.slice(0, 10),
      {
        title: "Ordered Products Report",
        path: "/ordered-products-report",
        icon: FaClipboardList,
      },
      ...menuItems.slice(10),
    ];
    console.log("[DEBUG] useUserMenuItems: Returning concated menu with added item");
    return concatedMenu;
  }
  console.log("[DEBUG] useUserMenuItems: Returning standard menuItems");
  return menuItems;
};
