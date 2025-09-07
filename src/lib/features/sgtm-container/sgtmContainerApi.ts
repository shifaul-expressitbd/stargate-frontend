import { baseApi } from "../../api/baseApi";

// Define tag type for consistency
const sgtmContainersTagType = "sgtmContainers" as const;

// Define types based on OpenAPI spec
interface SgtmContainer {
  id: string;
  name: string;
  fullName: string;
  containerId?: string;
  status: "PENDING" | "RUNNING" | "STOPPED" | "ERROR" | "DELETED";
  subdomain: string;
  config: string;
  region?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateContainerRequest {
  name: string;
  subdomain: string;
  config: string;
  region?: string;
}

interface UpdateConfigRequest {
  config?: string;
  serverContainerUrl?: string;
}

export const sgtmContainerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create container
    createContainer: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          commandId: string;
          exitCode: number;
          executionTime: number;
          containerId: string;
          container: SgtmContainer;
        };
      },
      CreateContainerRequest
    >({
      query: (data) => ({
        url: "/sgtm-containers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: sgtmContainersTagType, id: "LIST" }],
    }),

    // Get all containers
    getAllContainers: builder.query<{ success: boolean; data: SgtmContainer[] }, void>({
      query: () => ({
        url: "/sgtm-containers",
        method: "GET",
      }),
      providesTags: [{ type: sgtmContainersTagType, id: "LIST" }],
    }),

    // Get all containers with sync
    getAllContainersWithSync: builder.query<{ success: boolean; data: SgtmContainer[] }, void>({
      query: () => ({
        url: "/sgtm-containers/sync",
        method: "GET",
      }),
      providesTags: [{ type: sgtmContainersTagType, id: "LIST" }],
    }),

    // Get single container
    getContainer: builder.query<{ success: boolean; data: SgtmContainer }, string>({
      query: (id) => ({
        url: `/sgtm-containers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: sgtmContainersTagType, id }],
    }),

    // Get single container with sync
    getContainerWithSync: builder.query<{ success: boolean; data: SgtmContainer }, string>({
      query: (id) => ({
        url: `/sgtm-containers/${id}/sync`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: sgtmContainersTagType, id }],
    }),

    // Delete container
    deleteContainer: builder.mutation<
      {
        success: boolean;
        message: string;
        data: { commandId: string; exitCode: number; executionTime: number; containerId: string };
      },
      string
    >({
      query: (id) => ({
        url: `/sgtm-containers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: sgtmContainersTagType, id: "LIST" },
        { type: sgtmContainersTagType, id },
      ],
    }),

    // Get container config
    getContainerConfig: builder.query<
      { success: boolean; data: { config: string; decodedConfig: { serverContainerUrl: string } } },
      string
    >({
      query: (id) => ({
        url: `/sgtm-containers/${id}/config`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "sgtmContainers" as const, id }],
    }),

    // Update container config
    updateContainerConfig: builder.mutation<
      { success: boolean; message: string; data: { config: string; decodedConfig: { serverContainerUrl: string } } },
      { id: string; data: UpdateConfigRequest }
    >({
      query: ({ id, data }) => ({
        url: `/sgtm-containers/${id}/config`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: sgtmContainersTagType, id: "LIST" },
        { type: sgtmContainersTagType, id },
      ],
    }),

    // Stop container
    stopContainer: builder.mutation<
      {
        success: boolean;
        message: string;
        data: { commandId: string; exitCode: number; executionTime: number; containerId: string };
      },
      string
    >({
      query: (id) => ({
        url: `/sgtm-containers/${id}/stop`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: sgtmContainersTagType, id: "LIST" },
        { type: sgtmContainersTagType, id },
      ],
    }),

    // Restart container
    restartContainer: builder.mutation<
      {
        success: boolean;
        message: string;
        data: { commandId: string; exitCode: number; executionTime: number; containerId: string };
      },
      string
    >({
      query: (id) => ({
        url: `/sgtm-containers/${id}/restart`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: sgtmContainersTagType, id: "LIST" },
        { type: sgtmContainersTagType, id },
      ],
    }),

    // Hard delete container
    hardDeleteContainer: builder.mutation<
      { success: boolean; message: string; data: { id: string; deleted: boolean } },
      string
    >({
      query: (id) => ({
        url: `/sgtm-containers/${id}/hard`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: sgtmContainersTagType, id: "LIST" },
        { type: sgtmContainersTagType, id },
      ],
    }),
  }),
});

export const {
  useCreateContainerMutation,
  useGetAllContainersQuery,
  useGetAllContainersWithSyncQuery,
  useGetContainerQuery,
  useGetContainerWithSyncQuery,
  useDeleteContainerMutation,
  useGetContainerConfigQuery,
  useUpdateContainerConfigMutation,
  useStopContainerMutation,
  useRestartContainerMutation,
  useHardDeleteContainerMutation,
} = sgtmContainerApi;
