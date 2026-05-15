"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toast } from "@heroui/react";
import { Provider } from "react-redux";

import { store } from "@/store";
import AuthProvider from "@/providers/AuthProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <>
      <Toast.Provider placement="bottom end" />
      <Provider store={store}>
        {/* <PersistGate loading={<Overlay />} persistor={persistor}> */}
        <NextThemesProvider {...themeProps}>
          <AuthProvider>{children}</AuthProvider>
        </NextThemesProvider>
        {/* </PersistGate> */}
      </Provider>
    </>
  );
}
