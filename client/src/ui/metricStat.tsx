import { Stat as BaseStat, StatLabel, StatNumber } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricCurrent } from "api";
import { Box, Center, Spinner } from "@liftedinit/ui";

interface StatProps {
  label: string;
  metric: string;
  conversion?: (value: any) => any;
  from?: string;
  to?: string;
  unit?: string;
  fixedDecimals?: number;
  intervalMs?: number;
  maxDataPoints?: number;
}

export function MetricStat({ 
  label, 
  metric, 
  conversion, 
  from, 
  to, 
  fixedDecimals, 
  unit, 
  intervalMs,
  maxDataPoints 
}: StatProps) {

  const { data: queryData, isLoading } = useQuery([metric + "current"], getManifestMetricCurrent(metric, {from: from, to: to, intervalMs: intervalMs, maxDataPoints: maxDataPoints}));

  let metricValues = [];
  let metricValue = "";


  if (!isLoading) {
    metricValues?.push(queryData);
    if (conversion && queryData != null) {
      metricValue = metricValues?.map(conversion)?.map((item) => Number((item as number).toFixed(fixedDecimals))).toLocaleString() || "N/A";
    }
    else if (!conversion && queryData != null) {
      metricValue = metricValues?.map((item) => Number(item.toFixed(fixedDecimals))).toLocaleString() || "N/A";
    }
    else {
      metricValue = "N/A";
    }
  }


  return (
    <>
      {isLoading ? (
      <Box bg="white" p={4}>
        <Center>
          <Spinner />
        </Center>
      </Box>
      ) : (
      <BaseStat bg="white" p={6} mb={5}>
        <StatLabel color="lifted.gray.500">{label}</StatLabel>
        <StatNumber>
          { metricValue } {unit}
        </StatNumber>
      </BaseStat>
      )}
  </>
  );
}
