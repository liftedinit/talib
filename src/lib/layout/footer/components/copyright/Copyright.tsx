import { Box, Stack, Text } from "@chakra-ui/react";

export default function Copyright() {
  return (
    <Stack align={{ md: "flex-start", sm: "center" }} spacing={6}>
      <Box fontSize="sm">
        <Text color="Cream">
          © 2022 THE LIFTED INITIATIVE. All rights reserved
        </Text>
      </Box>
    </Stack>
  );
}
