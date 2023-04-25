import { Code, Text } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { ago } from "utils";

export function basics(data: any) {
  return {
    Hash: <Code>{data.hash}</Code>,
    Height: (
      <Text as={Link} to={`/blocks/${data.blockHeight}`} color="brand.teal.500">
        {data.blockHeight.toLocaleString()}
      </Text>
    ),
    Time: (
      <Text>
        {ago(new Date(data.dateTime))} (
        <Code>{new Date(data.dateTime).toISOString()}</Code>)
      </Text>
    ),
  };
}
