import { Code } from "@liftedinit/ui";
import { Link } from "react-router-dom";

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
    Key: (
      <Code maxW="50em"> 
        {data.argument.key}
      </Code>
    ),
  };
}
