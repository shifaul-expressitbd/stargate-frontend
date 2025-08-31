// roleApi.ts
import type { MetaResponse } from "@/types/TMetaResponse.type";
import type { CreateRolePayload, Role, RoleQueryParams, UpdateRolePayload } from "@/types/TRole.type";
import { baseApi } from "../../api/baseApi";

const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<Role, CreateRolePayload>({
      query: (roleData) => ({
        url: "/roles/create",
        method: "POST",
        body: roleData,
      }),
      invalidatesTags: ["roles"],
    }),

    getAllRoles: builder.query<{ data: Role[]; meta: MetaResponse }, RoleQueryParams>({
      query: (params) => ({
        url: "/roles",
        method: "GET",
        params: {
          search: params.search,
          sort: params.sort,
          page: params.page,
          limit: params.limit,
          fields: params.fields,
          role: params.role,
        },
      }),
      transformResponse: (response: { data: Role[]; meta: MetaResponse }) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["roles"],
    }),

    getRoleById: builder.query<Role, string>({
      query: (id) => `/roles?_id=${id}`,
      transformResponse: (response: { data: Role[] }) => {
        if (!response.data || response.data.length === 0) {
          throw new Error("Role not found");
        }
        return response.data[0];
      },
      providesTags: (_result, _error, id) => [{ type: "roles", id }],
    }),

    updateRole: builder.mutation<Role, { id: string; data: UpdateRolePayload }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "roles", id }, "roles"],
    }),

    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["roles"],
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
