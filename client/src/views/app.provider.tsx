import { theme, ThemeProvider } from "@liftedinit/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { HashRouter } from "react-router-dom";

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>{children}</HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
