import { theme, ThemeProvider, ColorModeScript } from "@liftedinit/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";

import { NeighborhoodProvider, TopNavProvider } from "api";
import {
  Address,
  Block,
  Blocks,
  Home,
  Layout,
  Metrics,
  Map,
  Migration,
  Migrations,
  Transaction,
  Transactions,
  WideLayout,
} from "pages";

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
          <NeighborhoodProvider>
            <TopNavProvider>
              <HashRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Outlet />
                      </Layout>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="blocks">
                      <Route index element={<Blocks />} />
                      <Route path=":hash" element={<Block />} />
                    </Route>
                    <Route path="transactions">
                      <Route index element={<Transactions />} />
                      <Route path=":hash" element={<Transaction />} />
                    </Route>
                    <Route path="addresses">
                      <Route path=":address" element={<Address />} />
                      <Route path=":hash" element={<Transaction />} />
                    </Route>
                    <Route path="migrations">
                      <Route index element={<Migrations />} />
                      <Route path=":hash" element={<Migration />} />
                    </Route>
                  </Route>
                  <Route path="metrics" element={
                    <WideLayout>
                      <Metrics />
                    </WideLayout>
                    }
                  >
                  </Route>
                  <Route path="map" element={
                  <WideLayout><Map /></WideLayout>}
                  ></Route>

                </Routes>
              </HashRouter>
            </TopNavProvider>
          </NeighborhoodProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
