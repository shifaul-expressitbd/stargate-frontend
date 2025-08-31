// profileApi.ts
import type { UserProfile } from "@/types/TUserProfile.type";
import { baseApi } from "../../api/baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch user's profile
    getProfile: builder.query({
      query: () => "/profile",
      transformResponse: (response: { data: UserProfile }) => response.data,
      providesTags: ["profile"],
    }),

    // Update user's profile
    updateProfile: builder.mutation<UserProfile, FormData>({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
