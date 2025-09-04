import { baseApi } from "../../api/baseApi";

// Define types based on OpenAPI spec
interface SgtmRegion {
  key: string;
  name: string;
  apiUrl: string;
  apiKey?: string;
  isActive?: boolean;
  isDefault?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateRegionRequest {
  key: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  description?: string;
}

interface UpdateRegionRequest {
  name?: string;
  apiUrl?: string;
  apiKey?: string;
  isActive?: boolean;
  description?: string;
}

export const sgtmRegionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create region
    createRegion: builder.mutation<{ success: boolean; data: SgtmRegion }, CreateRegionRequest>({
      query: (data) => ({
        url: "/sgtm-regions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sgtmRegions"],
    }),

    // Get all regions
    getAllRegions: builder.query<SgtmRegion[], void>({
      query: () => ({
        url: "/sgtm-regions",
        method: "GET",
      }),
      transformResponse: (response: { data?: SgtmRegion[] }) => response.data || [],
      providesTags: ["sgtmRegions"],
    }),

    // Get available regions
    getAvailableRegions: builder.query<SgtmRegion[], void>({
      query: () => ({
        url: "/sgtm-regions/available",
        method: "GET",
      }),
      providesTags: ["sgtmRegions"],
    }),

    // Get region by key
    getRegionByKey: builder.query<SgtmRegion, string>({
      query: (key) => ({
        url: `/sgtm-regions/${key}`,
        method: "GET",
      }),
      providesTags: (_result, _error, key) => [{ type: "sgtmRegions" as const, id: key }],
    }),

    // Update region
    updateRegion: builder.mutation<SgtmRegion, { key: string; data: UpdateRegionRequest }>({
      query: ({ key, data }) => ({
        url: `/sgtm-regions/${key}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "sgtmRegions", id: arg.key },
        { type: "sgtmRegions", id: "LIST" },
      ],
    }),

    // Delete region
    deleteRegion: builder.mutation<void, string>({
      query: (key) => ({
        url: `/sgtm-regions/${key}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "sgtmRegions", id: "LIST" }],
    }),

    // Set region as default
    setDefaultRegion: builder.mutation<SgtmRegion, string>({
      query: (key) => ({
        url: `/sgtm-regions/${key}/set-default`,
        method: "PUT",
      }),
      invalidatesTags: ["sgtmRegions"],
    }),

    // Toggle region active status
    toggleRegionActive: builder.mutation<SgtmRegion, string>({
      query: (key) => ({
        url: `/sgtm-regions/${key}/toggle-active`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, key) => [
        { type: "sgtmRegions", id: key },
        { type: "sgtmRegions", id: "LIST" },
      ],
    }),

    // Seed default regions
    seedDefaultRegions: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: "/sgtm-regions/seed-default",
        method: "POST",
      }),
      invalidatesTags: ["sgtmRegions"],
    }),
  }),
});

export const {
  useCreateRegionMutation,
  useGetAllRegionsQuery,
  useGetAvailableRegionsQuery,
  useGetRegionByKeyQuery,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
  useSetDefaultRegionMutation,
  useToggleRegionActiveMutation,
  useSeedDefaultRegionsMutation,
} = sgtmRegionApi;
