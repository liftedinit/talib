import React from "react";
import { HashRouter } from "react-router-dom";
import {
  QueryClientProvider,
  ThemeProvider,
  queryClient,
  theme,
} from "@liftedinit/ui";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>{children}</HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
