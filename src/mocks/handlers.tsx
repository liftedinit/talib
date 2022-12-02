// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from "msw";

import BlockchainInfoMock from "./request/blockchaininfomock";
import NetworkStatusMock from "./request/networkstatus";

// Define handlers that catch the corresponding requests and returns the mock data.
const handlers = [
  rest.get("http://localhost:8000/api/blockchain/info", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(BlockchainInfoMock));
  }),
  rest.get("http://localhost:8000/api/network/status", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(NetworkStatusMock));
  }),
];

export default handlers;
