// supportApi.ts
import { baseApi } from "@/lib/api/baseApi";
import type { SupportTicket } from "@/types/TSupport.type";

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all support tickets with various query parameters
    getAllSupportTickets: builder.query({
      query: (params?: {
        search?: string;
        page?: number;
        limit?: number;
        _id?: string;
        email?: string;
        sort?: string;
      }) => ({
        url: "/admin-api/support/tickets",
        method: "GET",
        params: {
          search: params?.search,
          page: params?.page,
          limit: params?.limit,
          _id: params?._id,
          email: params?.email,
          sort: params?.sort,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: SupportTicket) => ({
                type: "SupportTickets" as const,
                id: _id,
              })),
              { type: "SupportTickets", id: "LIST" },
            ]
          : [{ type: "SupportTickets", id: "LIST" }],
    }),

    // Update support ticket status
    updateSupportTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `/admin-api/support/ticket/${ticketId}/update-status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "SupportTickets", id: ticketId },
        { type: "SupportTickets", id: "LIST" },
      ],
    }),

    // Delete a support ticket
    deleteSupportTicket: builder.mutation<void, string>({
      query: (ticketId) => ({
        url: `/admin-api/support/ticket/${ticketId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, ticketId) => [
        { type: "SupportTickets", id: ticketId },
        { type: "SupportTickets", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetAllSupportTicketsQuery, useUpdateSupportTicketStatusMutation, useDeleteSupportTicketMutation } =
  supportApi;
