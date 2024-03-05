import { Alert, AlertIcon, Box, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNeighborhoodTransaction, NeighborhoodContext } from "api";
import { ObjectTable, QueryBox, TableObject, ExpandCode } from "ui";
import { basics, details } from ".";

import { useBgColor, useTextColor } from "utils";

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

  const bg = useBgColor();
  const textColor = useTextColor();

  // Add request and response (in CBOR) at the end
  txn = data
    ? {
        ...txn,
        Request: <ExpandCode content={data.request} />,
        Response: <ExpandCode content={data.response} />,
      }
    : txn;

  return (
    <Box my={6} bg={bg} p={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Transaction Details
      </Heading>
      { alertVisible ? (
        <Box bg="white" my={6}>
            <Alert status='error' textColor={textColor}>
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
