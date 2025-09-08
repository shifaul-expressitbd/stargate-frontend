// profileApi.ts
import type { UserProfile } from "@/types/TUserProfile.type";
import { baseApi } from "../../api/baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch user's profile
    getProfile: builder.query<UserProfile, void>({
      query: () => "/users/profile",
      transformResponse: (response: { data: UserProfile }) => response.data,
      providesTags: ["profile"],
    }),

    // Update user's profile
    updateProfile: builder.mutation<UserProfile, FormData>({
      query: (formData) => ({
        url: "/users/profile/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export default profileApi;
export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
