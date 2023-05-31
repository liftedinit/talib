import { Stat as BaseStat, StatLabel, StatNumber } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricCurrent } from "api";
import { Box, Center, Spinner } from "@liftedinit/ui";

interface StatProps {
  label: string;
  metric: string;
  conversion?: Function;
  from?: string;
  to?: string;
  fixedDecimals?: number;
  unit?: string;
}

export function MetricStat({ label, metric, conversion, from, to, fixedDecimals, unit }: StatProps) {

  const { data: queryData, isLoading } = useQuery([metric + "current"], getManifestMetricCurrent(metric));

  let metricValues: Array<any> = [];
  let metricValue: number | string = "";


  if (!isLoading) {
    metricValues?.push(queryData);
    if (conversion && queryData != null) {
      metricValue = metricValues?.map(conversion)?.map((item) => Number(item.toFixed(fixedDecimals))) || "N/A";
    }
    else if (!conversion && queryData != null) {
      metricValue = metricValues?.map((item) => Number(item.toFixed(fixedDecimals))) || "N/A";
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
      <BaseStat bg="white" p={6}>
        <StatLabel>{label}</StatLabel>
        <StatNumber>
          { metricValue } {unit}
        </StatNumber>
      </BaseStat>
      )}
  </>
  );
}
