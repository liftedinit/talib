import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";

const knownTokens = [
  {
    address: "mqbh742x4s356ddaryrxaowt4wxtlocekzpufodvowrirfrqaaaaa3l",
    ticker: "MFX",
    precision: 9,
  },
];

export function ledgerSend(data: any) {
  const token = knownTokens.find((t) => t.address === data.argument.symbol);
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
    Amount: token
      ? `${(data.argument.amount / 10 ** token.precision).toLocaleString()} ${
          token.ticker
        }`
      : "Unknown",
  };
}
