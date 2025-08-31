import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { baseApi } from "./api/baseApi";

import authReducer from "./features/auth/authSlice";
import sidebarReducer from "./features/sidebar/sidebarSlice";
import themeReducer from "./features/theme/themeSlice";

const rootReducer = combineReducers({
  // ✅ RTK-Query API slices
  [baseApi.reducerPath]: baseApi.reducer,

  // ✅ your other slices
  auth: authReducer,
  theme: themeReducer,
  sidebar: sidebarReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      // RTK-Query middleware must be added for each API slice
      .concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
