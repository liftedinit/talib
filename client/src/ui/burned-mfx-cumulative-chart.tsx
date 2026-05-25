import React from "react";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { Box, Center, Heading, Spinner, Text } from "@liftedinit/ui";
import { getBurnedMfxSeries } from "api";
import { useBgColor, LONG_STALE_INTERVAL, LONG_REFRESH_INTERVAL } from "utils";

interface Props {
  nid: number;
}

interface SeriesPayload {
  timestamps: (string | Date)[];
  data: string[];
}

// MFX has 9 decimal places — series values from the API are in uMFX.
// Use BigInt for the divide so cumulative uMFX values past
// Number.MAX_SAFE_INTEGER (~9e15, ≈ 9M MFX) don't silently lose precision.
const UMFX_PER_MFX = 1_000_000_000n;

const yAxisFormatter = (v: number) =>
  v.toLocaleString(undefined, { maximumFractionDigits: 0 });

export function BurnedMfxCumulativeChart({ nid }: Props) {
  const bg = useBgColor();

  const { data, isLoading, isError } = useQuery<SeriesPayload>(
    ["neighborhoods", nid, "migrations", "burned-mfx", "series"],
    getBurnedMfxSeries(nid),
    {
      staleTime: LONG_STALE_INTERVAL,
      refetchInterval: LONG_REFRESH_INTERVAL,
    },
  );

  if (isLoading) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%"><Spinner /></Center>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%">
          <Text color="brand.teal" fontWeight="bold">Error loading chart data</Text>
        </Center>
      </Box>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%"><Text color="brand.teal">No migrations yet</Text></Center>
      </Box>
    );
  }

  const seriesMfx = data.data.map((v) => Number(BigInt(v) / UMFX_PER_MFX));
  const categories = data.timestamps.map((t) =>
    t instanceof Date ? t.toISOString() : t,
  );

  return (
    <Box
      p={4}
      bg={bg}
      h={["200px", "300px", "400px"]}
      display="flex"
      flexDirection="column"
    >
      <Heading as="h5" size="sm" mb={2}>
        Cumulative Burned MFX
      </Heading>
      <Box flex="1" minH={0}>
      <Chart
        height="100%"
        type="area"
        series={[{ name: "Burned MFX", data: seriesMfx }]}
        options={{
          colors: ["#38C7B4"],
          dataLabels: { enabled: false },
          chart: { toolbar: { show: false }, animations: { enabled: false } },
          stroke: { curve: "smooth" },
          xaxis: {
            type: "datetime",
            categories,
            labels: {
              datetimeFormatter: { year: "yy", month: "MMM", day: "dd", hour: "HH:mm" },
            },
          },
          yaxis: {
            title: { text: "MFX", style: { fontSize: "1.25em", fontFamily: "Rubik, sans-serif" } },
            labels: { formatter: yAxisFormatter },
          },
        }}
        className="talib-chart"
      />
      </Box>
    </Box>
  );
}

export const MemoizedBurnedMfxCumulativeChart = React.memo(BurnedMfxCumulativeChart);
