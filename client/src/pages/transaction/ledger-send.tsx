import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { useFindToken } from "./tokens";

export function useLedgerSend(data: any) {
  const token = useFindToken(data.argument.symbol);

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
    Amount: `${parseFloat((
      data.argument.amount /
      10 ** token.precision
    ).toFixed(token.precision).toLocaleString())} ${token.symbol}`,
  };
}
