import { baseApi } from "../base";

import { authEndpoints } from "@/config/endpoints";

export interface SignUpBody {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  gender: string;
  dob: string;
}

export interface SignInBody {
  account: string;
  password: string;
}

export interface SignOutBody {
  refresh_token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body: SignUpBody) => ({
        url: authEndpoints.SIGN_UP,
        method: "POST",
        body,
        providesTags: ["User"],
      }),
    }),
    signin: builder.mutation({
      query: (body: SignInBody) => ({
        url: authEndpoints.SIGN_IN,
        method: "POST",
        body,
        providesTags: ["User"],
      }),
    }),
    signout: builder.mutation({
      query: (body: SignOutBody) => ({
        url: authEndpoints.SIGN_OUT,
        method: "POST",
        body,
        providesTags: ["User"],
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: authEndpoints.ME,
        method: "GET",
        providesTags: ["User"],
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useSignoutMutation,
  useLazyGetMeQuery,
} = authApi;
