import { Outlet, Route, Routes } from "react-router-dom";
import {
  Block,
  Blocks,
  Home,
  Layout,
  Transaction,
  Transactions,
} from "../views";

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
        <Route path="transactions">
          <Route index element={<Transactions />} />
          <Route path=":hash" element={<Transaction />} />
        </Route>
      </Route>
    </Routes>
  );
}
