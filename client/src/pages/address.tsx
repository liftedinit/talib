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
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodAddress, NeighborhoodContext } from "api";
import { TransactionList } from "ui";

export function Address() {
  const { id } = useContext(NeighborhoodContext);
  const { address } = useParams();

  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "addresses", address],
    getNeighborhoodAddress(id, address as string),
  );

  return (
    <Box my={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Address Details
      </Heading>
      <Box bg="white" my={6} p={6}>
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Table>
            <Tbody>
              <Tr>
                <Td>
                  <b>Address</b>
                </Td>
                <Td>
                  <Code>{address}</Code>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        )}
      </Box>
      {data?.transactions.length && (
        <>
          <Divider />
          <TransactionList
            txns={data.transactions}
            error={error as Error}
            isLoading={isLoading}
          />
        </>
      )}
    </Box>
  );
}
