import { Box, Stack, Text } from "@chakra-ui/react";

export default function Copyright() {
  return (
    <Stack align={{ md: "flex-start", sm: "center" }} spacing={6}>
      <Box fontSize="0.875rem" fontWeight={400}>
        <Text color="Cream">Copyright © 2022 • The Lifted Initiative</Text>
      </Box>
    </Stack>
  );
}
