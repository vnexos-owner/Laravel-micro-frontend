"use client";

import { createSlice } from "@reduxjs/toolkit";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/config";
import webLocalStorage from "@/utils/webLocalStorage";
import webStorageClient from "@/utils/webStorageClient";

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
    },
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    setAccessToken: (state, action) => {
      const { accessToken, expiredInSeconds } = action.payload;

      state.accessToken = accessToken;
      webStorageClient.set(ACCESS_TOKEN, accessToken, {
        expires: new Date(Date.now() + expiredInSeconds * 1000),
      });
    },
    signin: (state, action) => {
      const { accessToken, refreshToken, expiredInSeconds } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      webStorageClient.set(ACCESS_TOKEN, accessToken, {
        expires: new Date(Date.now() + expiredInSeconds * 1000),
      });
      webLocalStorage.set(REFRESH_TOKEN, refreshToken);
    },
    resetAuth: (state) => {
      state.user = null;
      state.refreshToken = null;
      state.accessToken = null;
    },
    signout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      webStorageClient.remove(ACCESS_TOKEN);
      webLocalStorage.remove(REFRESH_TOKEN);
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  signout,
  setTokens,
  signin,
  resetAuth,
} = authSlice.actions;
export default authSlice.reducer;
