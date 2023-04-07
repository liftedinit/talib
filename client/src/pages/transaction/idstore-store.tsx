import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";

export function idStoreStore(data: any) {
  return {
    Address: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.from}`}
        color="brand.teal.500"
      >
        {data.argument.address}
      </Code>
    ),
    Credentials: <Code>{data.argument.credentials}</Code>,
    PublicKey: <Code>{data.argument.publicKey}</Code>,
    "Recall Phrase": data.result.recallPhrase.join(" "),
  };
}
