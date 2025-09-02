import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyEmail: builder.query({
      query: (token: string) => ({
        url: `/auth/verify-email?token=${token}`,
        method: "GET",
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),
    refreshToken: builder.query({
      query: (rememberMe: boolean) => ({
        url: `/auth/refresh?rememberMe=${rememberMe}`,
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    // Backward compatibility hooks
    verifyNewUser: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "GET",
        params: { token: data.otp }, // Assuming OTP is the token
      }),
    }),
    verifyForgotPasswordOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: {
          token: data.otp,
          password: data.newPassword,
          email: data.credential,
        },
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyNewUserMutation,
  useVerifyForgotPasswordOtpMutation,
  useVerifyEmailQuery,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useRefreshTokenQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
} = authApi;
