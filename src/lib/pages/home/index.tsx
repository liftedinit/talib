import { Grid } from "@chakra-ui/react";

import BlockList from "lib/components/blocklist/BlockList";

const Home = () => {
  return (
    <Grid gap={4}>
      <BlockList />
    </Grid>
  );
};

export default Home;
