import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "`'Rubik', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'`",
    body: "`'Rubik', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'`",
  },
  colors: {
    white: "#ffffff",
    black: "#000000",
    green: "#8ddfd4",
    brown: "#654D43",
    cream: "#FAF0EA",
    grey: "#E2E2E2",
    aquamarine: "#6AA8A0",
    red: "#FF0000",
  },
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
    xl: "1200px",
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "#faf0ea",
        color: "#452e33",
        fontSize: "16px",
        fontWeight: "100",
      },
      // styles for the `a`
      a: {
        color: "#452e33",
        _hover: {
          textDecoration: "underline",
          color: "#8ddfd4",
        },
      },
      button: {
        color: "white",
        // backgroundColor: "#654D43",
        _disabled: {
          backgroundColor: "#654D43",
          borderColor: "gray.300",
          color: "#FAF0EA",
        },
        _hover: {
          color: "#FAF0EA",
          backgroundColor: "#654D43",
        },
      },
    },
  },
  components: {
    Footer: {
      bg: "#654D43",
      color: "#FAF0EA",
    },
    SocialLinks: {
      bg: "#8ddfd4",
      color: "#654D43",
    },
    Sitemap: {
      a: {
        color: "#ffffff",
      },
    },
    Logo: {
      color: "#faf0ea",
    },
    Copyright: {
      color: "#faf0ea",
    },
    TermsAndConditions: {
      a: {
        color: "#faf0ea",
      },
    },
    PaginationItem: {
      button: {
        with: "1.625rem",
        height: "1.625rem",
        backgroundColor: "white",
        color: "black",
      },
    },
    BlockList: {
      button: {
        color: "#654D43",
        backgroundColor: "white",
        _disabled: {
          backgroundColor: "gray.300",
          borderColor: "gray.300",
          color: "#654D43",
        },
        _hover: {
          color: "#FAF0EA",
          backgroundColor: "#654D43",
        },
      },
    },
  },
  config: {
    initialColorMode: "light",
  },
});
