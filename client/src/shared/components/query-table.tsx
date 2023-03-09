import { UseQueryResult } from "react-query";
import {
  Spinner,
  Box,
  Table,
  Heading,
  Flex,
  Spacer,
  Center,
} from "@liftedinit/ui";
import { ErrorAlert } from "../../shared";
import { ReactNode } from "react";

interface QueryTableProps {
  children: ReactNode;
  heading: string;
  query: UseQueryResult;
}

export function QueryTable({ children, heading, query }: QueryTableProps) {
  return (
    <Box bg="white" my={6} p={6}>
      <Flex mb={6}>
        <Heading size="sm">{heading}</Heading>
        <Spacer />
        {query.isError && <ErrorAlert error={query.error as Error} />}
      </Flex>
      <Table size="sm">
        {query.data ? (
          children
        ) : (
          <Center>
            <Spinner />
          </Center>
        )}
      </Table>
    </Box>
  );
}
