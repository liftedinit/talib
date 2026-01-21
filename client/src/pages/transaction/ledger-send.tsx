import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { useFindToken } from "./tokens";

export function useLedgerSend(data: any) {
  let symbol: string = "";
  let from: string = "";
  let to: string = "";
  let amount: any = "";

  if (!data.argument) {
    if (data._method === "ledger.send") {
      symbol = data.symbol;
      from = data.from;
      to = data.to;
      amount = data.amount;
    }
  } else {  
      symbol = data.argument.symbol;
      from = data.argument.from;
      to = data.argument.to;
      amount = data.argument.amount;
  }

  const token = useFindToken(symbol);

  return {
    From: (
      <Code
        as={Link}
        to={`/addresses/${from}`}
        color="brand.teal.500"
      >
        {from}
      </Code>
    ),
    To: (
      <Code
        as={Link}
        to={`/addresses/${to}`}
        color="brand.teal.500"
      >
        {to}
      </Code>
    ),
    Amount: `${parseFloat((
      amount /
      10 ** token.precision
    ).toFixed(token.precision).toLocaleString())} ${token.symbol}`,
  };
}
