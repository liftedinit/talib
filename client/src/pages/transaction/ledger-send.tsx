import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { findToken } from "./tokens";

export function ledgerSend(data: any) {
  const token = findToken(data.argument.symbol);
  return {
    From: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.from}`}
        color="brand.teal.500"
      >
        {data.argument.from}
      </Code>
    ),
    To: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.to}`}
        color="brand.teal.500"
      >
        {data.argument.to}
      </Code>
    ),
    Amount: `${(
      data.argument.amount /
      10 ** token.precision
    ).toLocaleString()} ${token.ticker}`,
  };
}
