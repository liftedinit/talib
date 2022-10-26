// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from "msw";

import BlockinformationMock from "./request/blockinformationmock";

// Define handlers that catch the corresponding requests and returns the mock data.
const handlers = [
  rest.get("http://localhost:3000/blockinformation", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(BlockinformationMock));
  }),
];

export default handlers;
