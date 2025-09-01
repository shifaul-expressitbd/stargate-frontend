import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
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

// const API_URL: string = '/v2/api'
// const API_URL: string = 'http://192.168.0.250:5000/v2/api'
// const API_URL: string = 'http://192.168.0.250:5001/v2/api'
const API_URL: string = "https://backend.stargate.app/v2/api";
// const API_URL: string = 'https://developer.stargate.app/v2/api'

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL || "https://backend.stargate.app/v2/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

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
        const refreshResult = await baseQuery(
          {
            url: `${API_URL}/auth/refresh-token`,
            method: "POST",
            credentials: "include",
            // body: { refreshToken: (api.getState() as RootState).auth.token }
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const response = refreshResult.data as {
            token: string;
            refreshToken?: string;
          };
          api.dispatch(
            setUser({
              token: response.token,
              refreshToken: response.refreshToken,
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
  ],
  endpoints: () => ({}),
});
