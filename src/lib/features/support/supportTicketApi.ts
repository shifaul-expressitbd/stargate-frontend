import { baseApi } from '@/lib/api/baseApi'

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all tickets
    getTickets: builder.query({
      query: (params?: { search?: string; page?: number; limit?: number }) => ({
        url: '/support/ticket',
        method: 'GET',
        params: {
          search: params?.search,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({
                type: 'tickets' as const,
                id: _id,
              })),
              { type: 'tickets', id: 'LIST' },
            ]
          : [{ type: 'tickets', id: 'LIST' }],
    }),

    // Create a new ticket
    createTicket: builder.mutation({
      query: (data) => {
        const body = new FormData()
        // If data is in the form { data: {...}, images: [...] }
        if (data.data) {
          // If data.data is already a string, use as is; otherwise, stringify
          const dataField =
            typeof data.data === 'string'
              ? data.data
              : JSON.stringify(data.data)
          body.append('data', dataField)
        } else {
          // fallback for legacy usage
          Object.entries(data).forEach(([key, value]) => {
            if (
              key !== 'images' &&
              value !== undefined &&
              value !== null &&
              value !== ''
            ) {
              body.append(key, value instanceof Blob ? value : String(value))
            }
          })
        }
        // Append images if present and are File(s)
        if (data.images) {
          if (Array.isArray(data.images)) {
            data.images.forEach((file: File) => {
              if (file instanceof File) {
                body.append('images', file, file.name)
              }
            })
          } else if (data.images instanceof File) {
            body.append('images', data.images, data.images.name)
          }
        }
        return {
          url: '/support/ticket/create',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: [{ type: 'tickets', id: 'LIST' }],
    }),

    // Get single ticket by ID
    getTicket: builder.query({
      query: (id) => `/support/ticket?_id=${id}`,
      providesTags: (_result, _error, id) => [{ type: 'tickets', id }],
    }),

    // Update ticket
    updateTicket: builder.mutation({
      query: ({ id, data }) => ({
        url: `/support/ticket/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'tickets', id },
        { type: 'tickets', id: 'LIST' },
      ],
    }),

    // Delete ticket
    deleteTicket: builder.mutation<void, string>({
      query: (id) => ({
        url: `/support/ticket/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'tickets', id },
        { type: 'tickets', id: 'LIST' },
      ],
    }),

    // Reply to a ticket
    replyToTicket: builder.mutation({
      query: ({
        ticketId,
        message,
        isInternalNote = false,
        attachments = [],
      }) => {
        const body = new FormData()
        body.append('message', message)
        body.append('isInternalNote', String(isInternalNote))

        // Append attachments if present
        if (attachments.length > 0) {
          attachments.forEach((file: File) => {
            if (file instanceof File) {
              body.append('attachments', file, file.name)
            }
          })
        }

        return {
          url: `/support/ticket/${ticketId}/reply`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: 'tickets', id: ticketId },
      ],
    }),

    // Request to reopen a ticket
    reopenTicket: builder.mutation({
      query: ({ ticketId, reason }) => ({
        url: `/support/ticket/${ticketId}/reopen`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: 'tickets', id: ticketId },
      ],
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useGetTicketQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useReplyToTicketMutation,
  useReopenTicketMutation,
} = supportApi
