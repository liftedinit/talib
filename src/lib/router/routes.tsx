import type { PathRouteProps } from "react-router-dom";

import Home from "lib/pages/home";
import Nodes from "lib/pages/nodes";

export const routes: Array<PathRouteProps> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/nodes",
    element: <Nodes />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [];
