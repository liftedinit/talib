import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";

export function idStoreStore(data: any) {
  return {
    Address: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.address}`}
        color="brand.teal.500"
      >
        {data.argument.address}
      </Code>
    ),
    Credentials: <Code maxW="50em">{data.argument.credentials}</Code>,
    PublicKey: <Code maxW="50em">{data.argument.publicKey}</Code>,
    "Recall Phrase": data.result.recallPhrase.join(" "),
  };
}
