import { Alert, AlertIcon, Box, Code, Center, Spinner, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodMigration, NeighborhoodContext } from "api";
import { ObjectTable, QueryBox, TableObject, ExpandCode } from "ui";
import { migrationDetails as details, status } from ".";

import { useBgColor, useAltTextColor } from "utils";

export function Migration() {
  const { id } = useContext(NeighborhoodContext);
  const { hash } = useParams();

  const [alertVisible, setAlertVisible] = useState(false);

  const query = useQuery(
    ["neighborhoods", id, "migrations", hash],
    getNeighborhoodMigration(id, hash as string),
  );
  const { data, isError, isSuccess } = query;

  // Start with migration basics
  let migration: TableObject = data ? data : {};

  // Add status if populated and expand details
  if (data?.status) {
    migration = { ...status(data), ...details(data) };
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
  const textColor = useAltTextColor();

  return (
    <Box my={6} bg={bg} p={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Migration Details
      </Heading>
      { alertVisible ? (
        <Box bg="white" my={6}>
            <Alert status='warning'>
                <AlertIcon />
                <Text color={textColor}>
                Migration not found
                </Text>
            </Alert>
        </Box>
      ) : (
      <QueryBox query={query}>
        <ObjectTable obj={migration} />
      </QueryBox>
      )}
    </Box>
  );
}
