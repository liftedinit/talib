import type { PathRouteProps } from "react-router-dom";

import Address from "lib/pages/address";
import Block from "lib/pages/block";
import Home from "lib/pages/home";
import Nodes from "lib/pages/nodes";
import Transaction from "lib/pages/transaction";

export const routes: Array<PathRouteProps> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/nodes",
    element: <Nodes />,
  },
  {
    path: "/block",
    element: <Block />,
  },
  {
    path: "/transaction",
    element: <Transaction />,
  },
  {
    path: "/address",
    element: <Address />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [];
