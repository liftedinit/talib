import { Table, Tbody, Td, Tr } from "@liftedinit/ui";
import { ReactNode } from "react";

export interface TableObject {
  [key: string]: ReactNode;
}

interface ObjectTableProps {
  obj: TableObject;
}

export function ObjectTable({ obj }: ObjectTableProps) {
  return (
    <Table class="table-lifted">
      <Tbody>
        {Object.entries(obj).map(([key, value]) => (
          <Tr>
            <Td valign="top">
              <b>{key}</b>
            </Td>
            <Td>{value}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
