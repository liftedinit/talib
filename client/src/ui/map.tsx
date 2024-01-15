import { useState, useCallback, useMemo } from 'react';
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
import { useMapBgColor, useMapStrokeColor, useMarkerColor, useMarkerStrokeColor } from 'utils';

export function MapChart() {

  const bg = useMapBgColor();
  const stroke = useMapStrokeColor();
  const markerColor = useMarkerColor();
  const strokeColor = useMarkerStrokeColor();

  const [markersCount, setMarkersCount] = useState(0);
  const { data, isError, isLoading } = useQuery(['locations'], getLocations());
  const [isGeographiesLoaded, setIsGeographiesLoaded] = useState(false);

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
      {isLoading && isGeographiesLoaded ? (
        <Box p={4} bg={bg}>
        <Center>
          <Spinner />
        </Center>
      </Box>
      ) : (
      <Box p={4} mt={10} bg={bg}>
        <ComposableMap 
        projection="geoMercator" height={350} width={1000}>
          <ZoomableGroup center={[0, 0]} zoom={1}>
            <Geographies geography="/features.json" onLoad={() => setIsGeographiesLoaded(true)}>
              {({ geographies }) =>
                geographies.map((geo) => <ChakraGeography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  stroke={stroke}
                  strokeWidth={0.5}
                  outline="none"
                  style={{
                    default: {
                      fill: "#15151a",
                    },
                    hover: {
                      fill: "#2c2c31",
                    },
                    pressed: {
                      fill: "#444448",
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
                <Location radius={15} fillColor={markerColor} strokeColor={strokeColor} />
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
