import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/es/storage";
import { persistReducer } from "redux-persist";

import authReducer from "./slices/authSlice";
import { baseApi } from "./base";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: [],
};
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store: any = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
// export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
