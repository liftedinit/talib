import { Stat as BaseStat, StatLabel, StatNumber } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { getMetricCurrent, getMetricTransformCurrent, getMetricSystemWideCurrent } from "api";
import { Box, Center, Spinner } from "@liftedinit/ui";

import { useBgColor } from 'utils';

interface StatProps {
  label: string;
  metric?: string;
  conversion?: (value: any) => any;
  from?: string;
  to?: string;
  unit?: string;
  fixedDecimals?: number;
  transform?: string;
  systemwide?: boolean;
}

interface QueryData {
  timestamp: (number|string);
  data: number;
  id: number
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
  transform,
  systemwide,
}: StatProps) {

  const bg = useBgColor();

  type metricQueryFunction = () => void;

  let metricQuery: metricQueryFunction;

  if (transform) {
    metricQuery = getMetricTransformCurrent(metric, transform, {from: from, to: to })
    }
  else if (systemwide) {
    metricQuery = getMetricSystemWideCurrent(metric)
  }
  else {
    metricQuery = getMetricCurrent(metric, {from: from, to: to })
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
      <Box p={4} bg={bg}>
        <Center>
          <Spinner />
        </Center>
      </Box>
      ) : (
      <BaseStat p={6} bg={bg}>
        <StatLabel>{label}</StatLabel>
        <StatNumber>
          { metricValue } {unit}
        </StatNumber>
      </BaseStat>
      )}
  </>
  );
}
