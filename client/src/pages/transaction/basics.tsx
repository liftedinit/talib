import { Code, Text, Tag } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { ago } from "utils";

export function basics(data: any) {

  let errorMsg: string = "";

  if (data.error && data.error.message) {
    errorMsg = (data?.error?.message || '').replace(/\.\s*$/, '');
  }

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
    ...( data.error && data.error.message ? {
      Error: (
        <Text>
        <Tag variant="outline" size="sm" colorScheme="red">
          {errorMsg}
        </Tag>
      </Text>
      )
    } : {})
  };
}
