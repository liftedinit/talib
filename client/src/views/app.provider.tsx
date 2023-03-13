import { theme, ThemeProvider } from "@liftedinit/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { HashRouter } from "react-router-dom";
import { NeighborhoodProvider } from "../features/neighborhoods";

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <NeighborhoodProvider>
          <HashRouter>{children}</HashRouter>
        </NeighborhoodProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
