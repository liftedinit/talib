import { Heading, SimpleGrid, Center, Grid, GridItem } from "@liftedinit/ui";
import { MapChart } from "ui";

export function Map() {
  return (
    <>
    <Grid gap={3}>
        <Center mt={12}>
          <Heading fontWeight="light">
            Nodes on the <b>Manifest</b> Network
          </Heading>
        </Center>
      <GridItem>
        <SimpleGrid gap="3" mt={2} id="map">
          <MapChart />
        </SimpleGrid>
      </GridItem>
    </Grid>
  </>
  );
}
