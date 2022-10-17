import { IconButton, useToast } from "@chakra-ui/react";
import { RiFileCopyLine } from "react-icons/ri";

import { theme } from "lib/styles/customTheme";

interface Props {
  value: string;
}

const Clipboard = ({ value }: Props) => {
  const toast = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast({
      status: "success",
      duration: 9000,
      containerStyle: {
        backgroundColor: theme.colors.green,
        borderRadius: "0.5em",
      },
      colorScheme: "green",
      isClosable: true,
      title: "Copied to clipboard",
    });
  };

  return (
    <IconButton
      display="flex"
      justifyContent="center"
      alignItems="center"
      variant="unstyled"
      padding={0}
      colorScheme={theme.colors.black}
      aria-label="copy to clipboard"
      fontSize="20px"
      size="sm"
      onClick={copyToClipboard}
      icon={<RiFileCopyLine />}
      _hover={{ backgroundColor: "transparent", color: theme.colors.black }}
    />
  );
};
export default Clipboard;
