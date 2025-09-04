import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ResponsiveProvider } from "../../providers/ResponsiveProvider";
import { persistor, store } from "../store";
import { ThemeProvider } from "./theme-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ResponsiveProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ResponsiveProvider>
      </PersistGate>
    </Provider>
  );
};
