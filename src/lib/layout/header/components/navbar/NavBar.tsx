import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import MenuDesktop from "../menudesktop/MenuDesktop";
import MenuMobile from "../menumobile/MenuMobile";

const Navbar = () => {
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 481
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const displayDesktop = () => {
    return <MenuDesktop />;
  };

  const displayMobile = () => {
    return <MenuMobile />;
  };

  return (
    <header>
      <Box>{mobileView ? displayMobile() : displayDesktop()}</Box>
    </header>
  );
};

export default Navbar;
