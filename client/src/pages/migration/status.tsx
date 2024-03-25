import { Tag, Text } from "@liftedinit/ui";
import { UseQueryResult } from "@tanstack/react-query";
import { TableObject } from "ui";

type StatusDetail = {
  text: string;
  colorScheme: string;
};

type StatusDetailsType = {
  [key: number]: StatusDetail;
};

const statusDetails: StatusDetailsType = {
  1: { text: "created", colorScheme: "green" },
  2: { text: "claimed", colorScheme: "blue" },
  3: { text: "migrating", colorScheme: "yellow" },
  4: { text: "completed", colorScheme: "green" },
  5: { text: "failed", colorScheme: "red" },
};

export function status(data: any): TableObject {
  const statusDetail = statusDetails[data.status] || { text: "Unknown", colorScheme: "gray" };

  return {
    Status: (
      <Text>
        <Tag variant="outline" size="sm" colorScheme={statusDetail.colorScheme}>
          {statusDetail.text}
        </Tag>
      </Text>
    ),
  };
}
