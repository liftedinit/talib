import { Box, Center, Spinner } from "@liftedinit/ui";
import { UseQueryResult } from "@tanstack/react-query";
import { ReactNode } from "react";

interface QueryBoxProps {
  query: UseQueryResult;
  children: ReactNode;
}

export function QueryBox({ query, children }: QueryBoxProps) {
  const { isLoading } = query;
  return (
    <Box bg="white" my={6}>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        children
      )}
    </Box>
  );
}
