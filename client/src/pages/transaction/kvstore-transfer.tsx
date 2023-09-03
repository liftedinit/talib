import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { findToken } from "./tokens";

export function kvstoreTransfer(data: any) {
  return {
    From: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.owner}`}
        color="brand.teal.500"
      >
        {data.argument.owner}
      </Code>
    ),
    To: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.new_owner}`}
        color="brand.teal.500"
      >
        {data.argument.new_owner}
      </Code>
    ),
  };
}
