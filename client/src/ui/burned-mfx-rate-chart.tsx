import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { Box, Center, Select, Spinner, Text, Flex } from "@liftedinit/ui";
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

const UMFX_PER_MFX = 1_000_000;

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

  const seriesMfx = rates.map((p) => Number(p.value) / UMFX_PER_MFX);
  const categories = rates.map((p) => p.date.toISOString());

  return (
    <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
      <Flex justify="flex-end" mb={2}>
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
      <Chart
        height="85%"
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
          },
        }}
        className="talib-chart"
      />
    </Box>
  );
}

export const MemoizedBurnedMfxRateChart = React.memo(BurnedMfxRateChart);
