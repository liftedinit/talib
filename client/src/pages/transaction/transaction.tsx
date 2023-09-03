import { Alert, AlertIcon, Box, Code,Center, Spinner, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodTransaction, NeighborhoodContext } from "api";
import { ObjectTable, QueryBox, TableObject } from "ui";
import { basics, details } from ".";

export function Transaction() {
  const { id } = useContext(NeighborhoodContext);
  const { hash } = useParams();

  const [alertVisible, setAlertVisible] = useState(false);

  const query = useQuery(
    ["neighborhoods", id, "transactions", hash],
    getNeighborhoodTransaction(id, hash as string),
  );
  const { data, isError, isSuccess } = query;

  // Start with transaction basics
  let txn: TableObject = data ? basics(data) : {};

  // Add details if they're populated
  if (data?.argument) {
    txn = { ...txn, ...details(data) };
  }

  useEffect(() => {
    if (isError) {
      setAlertVisible(true);
    }
    if (isSuccess) {
      setAlertVisible(false);
    }
  }, [isError, isSuccess]);

  // Add request and response (in CBOR) at the end
  txn = data
    ? {
        ...txn,
        Request: <Code maxW="50em">{data.request}</Code>,
        Response: <Code maxW="50em">{data.response}</Code>,
      }
    : txn;

  return (
    <Box my={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Transaction Details
      </Heading>
      { alertVisible ? (
        <Box bg="white" my={6}>
            <Alert status='error'>
                <AlertIcon />
                Transaction not found
            </Alert>
        </Box>
      ) : (
      <QueryBox query={query}>
        <ObjectTable obj={txn} />
      </QueryBox>
      )}
    </Box>
  );
}
