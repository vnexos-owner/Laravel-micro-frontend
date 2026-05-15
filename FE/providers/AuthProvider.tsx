"use client";

import { ReactNode, useEffect, useState } from "react";

import Overlay from "@/components/overlay";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLazyGetMeQuery } from "@/store/queries/auth";
import {
  resetAuth,
  setCredentials,
  setTokens,
  signout,
} from "@/store/slices/authSlice";
import webLocalStorage from "@/utils/webLocalStorage";
import webStorageClient from "@/utils/webStorageClient";

function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const refToken = useAppSelector((state: any) => state.auth.refreshToken);
  const cachedUser = useAppSelector((state: any) => state.auth.user);

  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const [fetchMe, { isLoading }] = useLazyGetMeQuery();

  useEffect(() => {
    const accessToken = webStorageClient.get(ACCESS_TOKEN);
    const refreshToken = webLocalStorage.get(REFRESH_TOKEN);

    if (refreshToken) {
      dispatch(setTokens({ accessToken, refreshToken }));
      // setIsInitializing(true);
    } else {
      setIsInitializing(false);
      dispatch(signout());
    }
  }, []);

  useEffect(() => {
    if (!refToken) {
      return;
    }

    if (cachedUser) {
      setIsInitializing(false);

      return;
    }

    setIsInitializing(true);
    fetchMe(null, false) // false = don't use cached value
      .unwrap()
      .then((data) => {
        dispatch(setCredentials(data));
      })
      .catch(() => {
        dispatch(resetAuth());
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, [refToken]);

  return isInitializing || isLoading ? <Overlay /> : <>{children}</>;
}

export default AuthProvider;
