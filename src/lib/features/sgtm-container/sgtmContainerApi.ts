import { baseApi } from "../../api/baseApi";

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
      invalidatesTags: ["sgtmContainers"],
    }),

    // Get all containers
    getAllContainers: builder.query<{ success: boolean; data: SgtmContainer[] }, void>({
      query: () => ({
        url: "/sgtm-containers",
        method: "GET",
      }),
      providesTags: ["sgtmContainers"],
    }),

    // Get all containers with sync
    getAllContainersWithSync: builder.query<{ success: boolean; data: SgtmContainer[] }, void>({
      query: () => ({
        url: "/sgtm-containers/sync",
        method: "GET",
      }),
      providesTags: ["sgtmContainers"],
    }),

    // Get single container
    getContainer: builder.query<{ success: boolean; data: SgtmContainer }, string>({
      query: (id) => ({
        url: `/sgtm-containers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "sgtmContainers" as const, id }],
    }),

    // Get single container with sync
    getContainerWithSync: builder.query<{ success: boolean; data: SgtmContainer }, string>({
      query: (id) => ({
        url: `/sgtm-containers/${id}/sync`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "sgtmContainers" as const, id }],
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
      invalidatesTags: [{ type: "sgtmContainers", id: "LIST" }],
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
      invalidatesTags: [{ type: "sgtmContainers", id: "LIST" }],
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
      invalidatesTags: [{ type: "sgtmContainers", id: "LIST" }],
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
      invalidatesTags: [{ type: "sgtmContainers", id: "LIST" }],
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
      invalidatesTags: [{ type: "sgtmContainers", id: "LIST" }],
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
