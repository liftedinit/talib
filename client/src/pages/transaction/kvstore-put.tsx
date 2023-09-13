import { Code, Text } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { ExpandCode } from "ui";

export function kvstorePut(data: any) {
  console.log(data)
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
    Key: (
      <Code maxW="50em"> 
        {data.argument.key}
      </Code>
    ),
    Value: (  
      <ExpandCode content={data.argument.value} />
    ),
  };
}
