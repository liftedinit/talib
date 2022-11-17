import { Card, CardBody } from "@chakra-ui/card";
import { Box, Heading, Text, Stack, Icon } from "@chakra-ui/react";
import type { IconType } from "react-icons";

import { theme } from "lib/styles/customTheme";

export type HcardProps = {
  title: string;
  icon?: IconType;
  content: string;
};

const Hcard = ({ icon, title, content }: HcardProps) => {
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      width="342px"
      height="120px"
      bgColor={theme.colors.white}
      m={3}
      borderRadius="md"
      boxShadow="dark-lg"
    >
      <Box p={2}>
        <Icon
          as={icon}
          fontSize="42"
          fontWeight={900}
          color={theme.colors.aquamarine}
        />
      </Box>
      <Stack>
        <CardBody p={2}>
          <Heading
            fontSize="0.875rem"
            fontWeight={500}
            color={theme.colors.black}
            size="md"
          >
            {title}
          </Heading>
          <Text
            fontSize="2.0rem"
            fontWeight={700}
            color={theme.colors.black}
            py="2"
          >
            {content}
          </Text>
        </CardBody>
      </Stack>
    </Card>
  );
};

export default Hcard;
