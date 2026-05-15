import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { setAccessToken, signout } from "./slices/authSlice";

import { RootState } from ".";

import webLocalStorage from "@/utils/webLocalStorage";
import { REFRESH_TOKEN } from "@/config";

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}api/`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");

    return headers;
  },
});

// Mutex flag: prevents multiple simulataneous refresh calls
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Wrapper with silent refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = webLocalStorage.get(REFRESH_TOKEN);

    if (!refreshToken) {
      api.dispatch(signout());

      return result;
    }

    // Only one refresh at a time, queue others behind the same promise
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = Promise.resolve(
        rawBaseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refresh_token: refreshToken },
          },
          api,
          extraOptions,
        ),
      ).finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    // All concurrent 401s await the same refresh promise
    const refreshResult = await refreshPromise!;
    const refreshData = refreshResult.data as RefreshTokenResponse | undefined;

    if (refreshData) {
      // Store new access token silently
      api.dispatch(
        setAccessToken({
          accessToken: refreshData.access_token,
          expiredInSeconds: refreshData.expires_in,
        }),
      );

      // Retry the original request with the new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(signout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["User"],
});
