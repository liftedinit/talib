import {
  Box,
  Center,
  Code,
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

import { getNeighborhoodTransaction, NeighborhoodContext } from "api";
import { PrettyMethods } from "ui";
import { ago } from "utils";

const knownTokens = [
  {
    address: "mqbh742x4s356ddaryrxaowt4wxtlocekzpufodvowrirfrqaaaaa3l",
    ticker: "MFX",
    precision: 9,
  },
];

export function Transaction() {
  const { id } = useContext(NeighborhoodContext);
  const { hash } = useParams();

  const { data, isLoading } = useQuery(
    ["neighborhoods", id, "transactions", hash],
    getNeighborhoodTransaction(id, hash as string),
  );

  let txn: { [key: string]: ReactNode } = data
    ? {
        Hash: <Code>{data.hash}</Code>,
        Height: data.blockHeight.toLocaleString(),
        Time: (
          <Text>
            {ago(new Date(data.dateTime))} (
            <Code>{new Date(data.dateTime).toISOString()}</Code>)
          </Text>
        ),
        Type: data.method ? (
          <Text>
            {PrettyMethods[data.method]} (<Code>{data.method}</Code>)
          </Text>
        ) : (
          "Unknown"
        ),
        Request: <Code maxW="50em">{data.request}</Code>,
        Response: <Code maxW="50em">{data.response}</Code>,
      }
    : {};

  if (data?.method === "ledger.send") {
    const token = knownTokens.find((t) => t.address === data.argument.symbol);
    txn = {
      ...txn,
      From: (
        <Link to={`/addresses/${data.argument.from}`}>
          <Text color="brand.teal.500">
            <pre>{data.argument.from}</pre>
          </Text>
        </Link>
      ),
      To: (
        <Link to={`/addresses/${data.argument.to}`}>
          <Text color="brand.teal.500">
            <pre>{data.argument.to}</pre>
          </Text>
        </Link>
      ),
      Amount: token
        ? `${(data.argument.amount / 10 ** token.precision).toLocaleString()} ${
            token.ticker
          }`
        : "Unknown",
    };
  }

  return (
    <Box my={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Transaction Details
      </Heading>
      <Box bg="white" my={6} p={6}>
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Table>
            <Tbody>
              {Object.entries(txn).map(([key, value]) => (
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
    </Box>
  );
}
