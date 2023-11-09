import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  chakra,
  Box,
  Center,
  Spinner,
  Tooltip,
  Text,
} from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { 
  ComposableMap, 
  Geographies, 
  Geography,   
  Marker,
  ZoomableGroup,
} from "react-simple-maps"
import { Location } from 'ui';
import { getLocations} from "api";
import { useMapBgColor, useMapStrokeColor, useMarkerColor} from 'utils';

export function MapChart() {

  const bg = useMapBgColor();
  const stroke = useMapStrokeColor();
  const markerColor = useMarkerColor();

  const [markersCount, setMarkersCount] = useState(0);
  const { data, isError, isLoading } = useQuery(['locations'], getLocations());
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    setIsDataLoaded(true);
  }, [data]);

  const ChakraGeography = chakra(Geography)

  let markers = useMemo(() => {
    if (!data) {
      return [];
    }
    
    return data.map((node: { longitude: number; latitude: number; }) => [
      node.longitude,
      node.latitude,
    ]);
  }, [data]);

  const calculateMarkersCount = useCallback((center: any, radius: number) => {
    let count = 0;
    markers.forEach((marker: any) => {
      const distance = Math.sqrt(
        Math.pow(center[0] - marker[0], 2) + Math.pow(center[1] - marker[1], 2)
      );
      if (distance <= radius) {
        count++;
      }
    });
    console.log("Count:", count)
    setMarkersCount(count);
  }, [markers]);

  const handleMouseEnter = (event: any, marker:any) => {
    calculateMarkersCount([marker[0], marker[1]], 3);
  };

  const handleMouseLeave = () => {
    setMarkersCount(0);
  };

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
          <ZoomableGroup center={[0, 0]} zoom={1}>
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
        {markers.map((marker: any) => (
          <>
          <Tooltip label={`${markersCount}`}>
          <Marker coordinates={marker}
          onMouseEnter={(event) => handleMouseEnter(event, marker)}
            onMouseLeave={handleMouseLeave} >
            <Location radius={2} fillColor={markerColor} borderColor="lifted.gray.200" />
          </Marker>
          </Tooltip>
          </>
        ))}
          </ZoomableGroup>
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
