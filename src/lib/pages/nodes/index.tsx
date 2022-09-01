import { Grid } from "@chakra-ui/react";

import NodesList from "lib/components/nodeslist/NodesList";

const Nodes = () => {
  return (
    <Grid gap={4}>
      <NodesList />
    </Grid>
  );
};

export default Nodes;
