import { useEffect, useState } from 'react';
import {
  chakra,
  Box,
  Center,
  Spinner,
  Text,
} from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { 
  ComposableMap, 
  Geographies, 
  Geography,   
  Marker,
} from "react-simple-maps"
import { getLocations} from "api";
import { useMapBgColor, useMapStrokeColor, useMarkerColor} from 'utils';

export function MapChart() {

  const bg = useMapBgColor();
  const stroke = useMapStrokeColor();
  const markerColor = useMarkerColor();

  const { data, isError, isLoading } = useQuery(['locations'], getLocations());
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track the loading status of the SVG

  useEffect(() => {
    setIsDataLoaded(true);
  }, [data]);


  // Wrap the Geography component with the chakra component
  const ChakraGeography = chakra(Geography)

  // If data create markers array of lat/long 
  let markers: [number, number][] = [];
  if (data) {
    data.forEach((node: { longitude: number; latitude: number; }) => {
      return markers.push([node.longitude, node.latitude]);
    })
  }

  return (
    <>
      {isLoading || !isDataLoaded ? (
        <Box p={4} bg={bg}>
        <Center>
          <Spinner />
        </Center>
      </Box>
      ) : (
      <Box p={4} mt={10} bg={bg}>
        <ComposableMap 
        projection="geoMercator" height={350} width={700}>
          <Geographies geography="/features.json">
            {({ geographies }) =>
              geographies.map((geo) => <ChakraGeography 
                key={geo.rsmKey} 
                geography={geo} 
                stroke={stroke}
                strokeWidth={0.5}
                outline="none"
                style={{
                  default: {
                    fill: "#38C7B4",
                  },
                  hover: {
                    fill: "#5CD1C1",
                  },
                  pressed: {
                    fill: "#2D9F90",
                  },
                }}
              />)
            }
          </Geographies>
        {markers.map((marker) => (
          <Marker coordinates={marker}>
            <circle r={2} fill={markerColor} />
          </Marker>
        ))}
        </ComposableMap>
      </Box>
      )}
      {isError && (
        <Box p={4} mt={10} bg={bg}>
          <Center>
            <Text color="brand.teal" fontWeight="bold">Error loading chart data</Text>
          </Center>
        </Box>
      )}
    </>
  );

}