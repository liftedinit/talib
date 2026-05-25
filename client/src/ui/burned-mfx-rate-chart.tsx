import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { Box, Center, Flex, Heading, Select, Spinner, Text } from "@liftedinit/ui";
import { getBurnedMfxSeries } from "api";
import { useBgColor, LONG_STALE_INTERVAL, LONG_REFRESH_INTERVAL } from "utils";
import {
  calculateRates,
  RATE_UNIT_LABELS,
  RATE_UNIT_OPTIONS,
  type CumulativePoint,
  type RateUnit,
} from "utils/burn-rate";

interface Props {
  nid: number;
}

interface SeriesPayload {
  timestamps: (string | Date)[];
  data: string[];
}

// MFX has 9 decimal places — series values from the API are in uMFX.
// Use BigInt for the divide so per-window uMFX deltas past
// Number.MAX_SAFE_INTEGER (~9e15, ≈ 9M MFX) don't silently lose precision.
const UMFX_PER_MFX = 1_000_000_000n;

const yAxisFormatter = (v: number) =>
  v.toLocaleString(undefined, { maximumFractionDigits: 0 });

export function BurnedMfxRateChart({ nid }: Props) {
  const bg = useBgColor();
  const [rateUnit, setRateUnit] = useState<RateUnit>("per_day");

  const { data, isLoading, isError } = useQuery<SeriesPayload>(
    ["neighborhoods", nid, "migrations", "burned-mfx", "series"],
    getBurnedMfxSeries(nid),
    {
      staleTime: LONG_STALE_INTERVAL,
      refetchInterval: LONG_REFRESH_INTERVAL,
    },
  );

  const cumulative: CumulativePoint[] = useMemo(() => {
    if (!data) return [];
    return data.timestamps.map((t, i) => ({
      date: t instanceof Date ? t : new Date(t),
      value: data.data[i],
    }));
  }, [data]);

  const rates = useMemo(
    () => calculateRates(cumulative, rateUnit),
    [cumulative, rateUnit],
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

  if (!data || data.data.length < 2) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%"><Text color="brand.teal">Insufficient data</Text></Center>
      </Box>
    );
  }

  const seriesMfx = rates.map((p) => Number(BigInt(p.value) / UMFX_PER_MFX));
  const categories = rates.map((p) => p.date.toISOString());

  return (
    <Box
      p={4}
      bg={bg}
      h={["200px", "300px", "400px"]}
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading as="h5" size="sm">MFX Burn Rate</Heading>
        <Select
          size="sm"
          width="auto"
          value={rateUnit}
          onChange={(e) => setRateUnit(e.target.value as RateUnit)}
        >
          {RATE_UNIT_OPTIONS.map((u) => (
            <option key={u} value={u}>{RATE_UNIT_LABELS[u]}</option>
          ))}
        </Select>
      </Flex>
      <Box flex="1" minH={0}>
      <Chart
        height="100%"
        type="area"
        series={[{ name: `MFX ${RATE_UNIT_LABELS[rateUnit]}`, data: seriesMfx }]}
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

export const MemoizedBurnedMfxRateChart = React.memo(BurnedMfxRateChart);
