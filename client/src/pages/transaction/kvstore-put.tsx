import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { findToken } from "./tokens";

export function kvstorePut(data: any) {
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
  };
}
