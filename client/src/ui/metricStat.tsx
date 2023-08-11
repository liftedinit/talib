import { Stat as BaseStat, StatLabel, StatNumber } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricCurrent, getManifestMetricTransformCurrent } from "api";
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
  transform?: string;
}

interface QueryData {
  timestamp: (number|string);
  data: number;
  id: number
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
  maxDataPoints, 
  transform,
}: StatProps) {

  type metricQueryFunction = () => void;

  let metricQuery: metricQueryFunction;

  if (transform) {
    metricQuery = getManifestMetricTransformCurrent(metric, transform, {from: from, to: to, intervalMs: intervalMs, maxDataPoints: maxDataPoints})
    }
  else {
    metricQuery = getManifestMetricCurrent(metric, {from: from, to: to, intervalMs: intervalMs, maxDataPoints: maxDataPoints})
  }

  const { data: queryData, isLoading } =  useQuery([metric + "current"], metricQuery);

  let metricValues = [];
  let metricValue = "";

  if (!isLoading && queryData) {

    // Apply type to destructured queryData
    const statData: QueryData = queryData;

    metricValues?.push(Number(statData.data));

    if (conversion && queryData != null) {
      metricValue = metricValues?.map(conversion)?.map(
        (item) => Number((item as number).toFixed(fixedDecimals))
        ).toLocaleString() || "N/A";
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
