import {
  Box,
  Center,
  Code,
  Divider,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodBlock, NeighborhoodContext } from "api";
import { TransactionList } from "ui";
import { ago } from "utils";

export function Block() {
  const { id } = useContext(NeighborhoodContext);
  const { hash } = useParams();
  let txns = [];

  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "blocks", hash],
    getNeighborhoodBlock(id, hash as string),
  );

  let block: { [key: string]: ReactNode } = data
    ? {
        Hash: <Code>{data.blockHash}</Code>,
        Height: data.height.toLocaleString(),
        Time: `${ago(new Date(data.dateTime))} (${new Date(
          data.dateTime,
        ).toLocaleString()})`,
      }
    : {};

  if (data) {
    txns = data.transactions.map((txn: any) => ({
      ...txn,
      blockHash: data.blockHash,
      blockHeight: data.height,
      dateTime: data.dateTime,
    }));
  }

  return (
    <Box my={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Block Details
      </Heading>
      <Box bg="white" my={6} p={6}>
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Table>
            <Tbody>
              {Object.entries(block).map(([key, value]) => (
                <Tr>
                  <Td>
                    <b>{key}</b>
                  </Td>
                  <Td>{value}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Divider />
      <TransactionList
        txns={txns}
        error={error as Error}
        isLoading={isLoading}
      />
    </Box>
  );
}
