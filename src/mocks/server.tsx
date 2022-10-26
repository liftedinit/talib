// eslint-disable-next-line import/no-extraneous-dependencies
import { setupServer } from "msw/node";

import handlers from "./handlers";
// This configures a Service Worker with the given request handlers.
const server = setupServer(...handlers);

export default server;
