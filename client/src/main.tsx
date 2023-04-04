import { theme, ThemeProvider } from "@liftedinit/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";

import { NeighborhoodProvider } from "api";
import {
  Address,
  Block,
  Blocks,
  Home,
  Layout,
  Transaction,
  Transactions,
} from "pages";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <NeighborhoodProvider>
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
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </NeighborhoodProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
