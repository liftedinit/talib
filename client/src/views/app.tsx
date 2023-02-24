import { Route, Routes } from "react-router-dom";
import { Home } from "../views";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  );
}
