import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import type { TUser } from "../features/auth/authSlice";
import { logout, setUser } from "../features/auth/authSlice";
import { type RootState } from "../store";

// Define your error response type
type ErrorResponse = {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
    error?: {
      path: string;
      message: string;
    };
  };
  status?: number;
};

const API_URL: string = "/api";
// const API_URL: string = "http://31.97.62.51:5555/api";
// const API_URL: string = "http://localhost:5555/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // First try to get token from Redux state
    let token = (getState() as RootState).auth.token;

    // If no token in state, try to get from storage
    if (!token) {
      try {
        token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      } catch (error) {
        console.warn("Error accessing token from storage:", error);
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
): Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error as ErrorResponse;
    const showError = (defaultMessage?: string) => {
      const message =
        (Array.isArray(data?.error) && data.error.length > 0 ? data.error[0].message : null) ||
        data?.message ||
        (data?.errors ? Object.values(data.errors).flat().join(" ") : null) ||
        defaultMessage;
      toast.error(message);
    };

    switch (status) {
      case 401: {
        const refreshToken = (api.getState() as RootState).auth.refreshToken;
        if (!refreshToken) {
          showError("No refresh token available.");
          api.dispatch(logout());
          return result;
        }
        const refreshResult = await baseQuery(
          {
            url: `/auth/refresh?rememberMe=true`,
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const response = refreshResult.data as {
            accessToken: string;
            refreshToken: string;
            user: TUser;
          };
          api.dispatch(
            setUser({
              token: response.accessToken,
              refreshToken: response.refreshToken,
              user: response.user,
            })
          );

          result = await baseQuery(args, api, extraOptions);
        } else {
          showError("Your session has expired. Please log in again.");
          api.dispatch(logout());
        }
        break;
      }
      case 402:
        if (data?.message === "Your subscription has expired! Please Contact Our Support Team. Call: 01779025322") {
          showError();
          // api.dispatch(setUser(null))
          window.location.href = "/subscription";
        }
        break;
      case 403:
        showError("You don't have permission to perform this action.");
        break;
      // case 404:
      //   break
      case 404:
        if (data?.message === "This user is not found!") {
          api.dispatch(logout());
        }
        break;
      case 405:
        showError();
        break;
      case 500:
        showError("Server error. Please try again later.");
        break;
      case 400:
        showError("Invalid request. Please check your input.");
        break;
      case 304:
        document.cookie.split(";").forEach((cookie) => {
          document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        showError("Server error. Go to Login Page or Home Page");
        break;
      default:
        showError("An unexpected error occurred.");
        break;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "businesses",
    "warehouses",
    "brands",
    "categories",
    "subcategories",
    "products",
    "endpoints",
    "roles",
    "employees",
    "files",
    "suppliers",
    "tagGroup",
    "customers",
    "sizeguards",
    "variations",
    "couriers",
    "posProducts",
    "posOrders",
    "posScheduleOrders",
    "lowStock",
    "orders",
    "scheduleorders",
    "subscriptionClients",
    "allUsers",
    "ownerUsers",
    "payments",
    "overview",
    "profile",
    "tickets",
    "SupportTickets",
    "profile",
    "expense",
    "areasOfExpense",
    "missingProducts",
    "dashboard",
    "sgtmContainers",
    "sgtmRegions",
  ],
  endpoints: () => ({}),
});
