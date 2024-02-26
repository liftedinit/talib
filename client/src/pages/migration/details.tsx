import { Code, Text } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { ago } from "utils";

export function migrationDetails(data: any) {
  return {
    Hash: (
      <Text as={Link} to={`/transactions/${data.manyHash}`} color="brand.teal.500">
        <Code>{data.manyHash}</Code>
      </Text>
    ),
    UUID: <Code>{data.uuid}</Code>,
    Created: (
      <Text>
        {ago(new Date(data.createdDate))} (
        <Code>{new Date(data.createdDate).toISOString()}</Code>)
      </Text>
    ),
    "Manifest Address": <Code>{data.manifestAddress}</Code>,
    ...(data.manifestHash !== null ? {
    "Manifest Hash": <Code>{data.manifestHash !== null ? data.manifestHash : "Unknown"}</Code>
    } : {}),
    ...(data.manifestDatetime !== null ? {
      Migrated: (
        <Text>
          {ago(new Date(data.manifestDatetime))} (
          <Code>{new Date(data.manifestDatetime).toISOString()}</Code>)
        </Text>
      ),
    } : {})
  };
}
