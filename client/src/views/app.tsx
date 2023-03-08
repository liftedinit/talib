import { Outlet, Route, Routes } from "react-router-dom";
import { Blocks, Home, Layout, Transactions } from "../views";

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
        <Route path="blocks" element={<Blocks />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}
