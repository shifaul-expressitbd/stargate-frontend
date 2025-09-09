import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
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
      query: ({ token, password }: { token: string; password: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    // Verify user with token (from email link or OTP)
    verifyNewUser: builder.mutation({
      query: (token: string) => ({
        url: "/auth/verify-email",
        method: "GET",
        params: { token },
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: (email: string) => ({
        url: "/auth/resend-verification-email",
        method: "POST",
        body: { email },
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
    // Two-factor authentication endpoints
    generateTwoFactorSecret: builder.query({
      query: () => ({
        url: "/auth/2fa/generate",
        method: "GET",
      }),
      providesTags: ["2fa"],
    }),
    verifyTwoFactor: builder.mutation({
      query: ({ code }) => ({
        url: "/auth/2fa/verify",
        method: "POST",
        body: { code },
      }),
    }),
    enableTwoFactor: builder.mutation({
      query: (data) => ({
        url: "/auth/2fa/enable",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["2fa", "profile"],
    }),
    disableTwoFactor: builder.mutation({
      query: (data) => ({
        url: "/auth/2fa/disable",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["2fa", "profile"],
    }),
    getTwoFactorStatus: builder.query({
      query: () => "/auth/2fa/status",
      providesTags: ["2fa"],
    }),
    // Provider management endpoints
    getUserProviders: builder.query({
      query: () => "/auth/providers",
      providesTags: ["providers"],
    }),
    unlinkProvider: builder.mutation({
      query: (provider) => ({
        url: "/auth/providers/unlink",
        method: "POST",
        body: { provider },
      }),
      invalidatesTags: ["providers"],
    }),
    setPrimaryProvider: builder.mutation({
      query: (provider) => ({
        url: "/auth/providers/set-primary",
        method: "POST",
        body: { provider },
      }),
      invalidatesTags: ["providers", "profile"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyNewUserMutation,
  useResendVerificationEmailMutation,
  useVerifyForgotPasswordOtpMutation,
  useVerifyEmailQuery,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useRefreshTokenQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGenerateTwoFactorSecretQuery,
  useVerifyTwoFactorMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
  useGetTwoFactorStatusQuery,
  useGetUserProvidersQuery,
  useUnlinkProviderMutation,
  useSetPrimaryProviderMutation,
} = authApi;
