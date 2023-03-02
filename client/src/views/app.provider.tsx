import {
  queryClient,
  QueryClientProvider,
  theme,
  ThemeProvider,
} from '@liftedinit/ui';
import React from 'react';
import { HashRouter } from 'react-router-dom';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>{children}</HashRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
