import { Outlet, Route, Routes } from "react-router-dom";
import { Block, Blocks, Home, Layout, Transactions } from "../views";

export function App() {
  return (
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
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}
