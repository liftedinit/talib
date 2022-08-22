import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  chakra,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

import { theme } from "lib/styles/customTheme";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontSize="1rem" fontWeight={400} mb={2}>
      {children}
    </Text>
  );
};
const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={theme.colors.green}
      rounded="full"
      w={8}
      h={8}
      cursor="pointer"
      as="a"
      href={href}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.3s ease"
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function SocialLinks() {
  return (
    <Stack mr={6} ml={6} align="flex-start">
      <ListHeader>JOIN THE COMMUNITY</ListHeader>
      <Box
        borderTopWidth={1}
        borderStyle="solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW="6xl"
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={{ md: "center" }}
        >
          <Stack direction="row" spacing={6}>
            <SocialButton label="Github" href="https://github.com/liftedinit">
              <FaGithub />
            </SocialButton>
            <SocialButton
              label="Linkedin"
              href="https://www.linkedin.com/company/liftedinit"
            >
              <FaLinkedin />
            </SocialButton>
            <SocialButton label="Twitter" href="https://twitter.com/liftedinit">
              <FaTwitter />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Stack>
  );
}
