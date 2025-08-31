import type { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

export type TUser = {
  userId: string;
  role: string;
  iat: number;
  exp: number;
  expiry_date: string;
  balance: string;
  name: string;
  owner_id: string;
  renewal_date: string;
  status: string;
  warning_date: string;
  user_id: string;
};

export type SubMenuItem = {
  title: string;
  path: string;
  icon: string;
};

export type MenuItem = {
  title?: string;
  path?: string;
  icon: string;
  element?: string;
  submenu?: SubMenuItem[];
};

export type Sidebar = MenuItem[][];

export type DashboardDesign = {
  best_selling_products_report: boolean;
  category_demand_report: boolean;
  courier_tracking_report: boolean;
  customer_resources_report: boolean;
  employee_report_report: boolean;
  income_expense_report: boolean;
  invest_stock_report: boolean;
  missing_products_report: boolean;
  order_analysis_report: boolean;
  order_sales_channel_report: boolean;
  sales_statistics_report: boolean;
  shorcut_overview_report: boolean;
  stats_report: boolean;
  subscription_used_report: boolean;
  top_customers_report: boolean;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
  hasBusiness: null | boolean;
  userProfile?:
    | {
        public_id: string | null;
        optimizeUrl: string | null;
        secure_url: string | null;
      }
    | undefined;
  sidebar: Sidebar;
  dashboardDesign: DashboardDesign;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  hasBusiness: null,
  userProfile: {
    public_id: null,
    optimizeUrl: null,
    secure_url: null,
  },
  sidebar: [],
  dashboardDesign: {
    best_selling_products_report: false,
    category_demand_report: false,
    courier_tracking_report: false,
    customer_resources_report: false,
    employee_report_report: false,
    income_expense_report: false,
    invest_stock_report: false,
    missing_products_report: false,
    order_analysis_report: false,
    order_sales_channel_report: false,
    sales_statistics_report: false,
    shorcut_overview_report: false,
    stats_report: false,
    subscription_used_report: false,
    top_customers_report: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token, hasBusiness, userProfile, dashboardDesign } = action.payload;
      state.user = user;
      state.token = token;
      state.hasBusiness = hasBusiness;
      state.userProfile = userProfile;
      state.dashboardDesign = dashboardDesign;
    },
    setSidebar: (state, action) => {
      state.sidebar = action.payload;
    },

    logout: (state) => {
      state.user = initialState.user;
      state.token = initialState.token;
      state.hasBusiness = initialState.hasBusiness;
      state.sidebar = initialState.sidebar;
      state.dashboardDesign = initialState.dashboardDesign;
      state.userProfile = initialState.userProfile;

      // Clear storages
      localStorage.clear();
      sessionStorage.clear();
      localStorage.removeItem("persist:root");

      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie.trim().split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      });

      // Clear IndexedDB
      window.indexedDB.databases().then((dbs) => {
        dbs.forEach((db) => {
          if (db.name) window.indexedDB.deleteDatabase(db.name);
        });
      });

      // Clear Cache Storage
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }

      // Unregister Service Workers
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
    },
  },
});

export const { setUser, logout, setSidebar } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectUserProfile = (state: RootState) => state.auth.userProfile;
export const selectUserHasBusiness = (state: RootState) => state.auth.hasBusiness;
export const selectIsLoggedIn = (state: RootState) => {
  return !!state.auth.token && !!state.auth.user;
};
export const selectDashboardDesign = (state: RootState) => state.auth.dashboardDesign;
export const selectSidebar = (state: RootState) => state.auth.sidebar;

export const selectSubscriptionExpired = (state: RootState) => {
  const user = state.auth.user;
  if (!user || !user.expiry_date) return false;
  const expiryDate = new Date(user.expiry_date).getTime();
  const now = Date.now();
  return now > expiryDate;
};
