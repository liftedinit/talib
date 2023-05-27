import { Stat as BaseStat, StatLabel, StatNumber } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricCurrent } from "api";
import { Spinner } from "@liftedinit/ui";

interface StatProps {
  label: string;
  metric: string;
  conversion?: Function;
  from?: string;
  to?: string;
  fixedDecimals?: number;
  unit: string;
}

export function MetricStat({ label, metric, conversion, from, to, fixedDecimals, unit }: StatProps) {

  const { data: queryData, isLoading } = useQuery([metric + "current"], getManifestMetricCurrent(metric));

  let metricValues: Array<any> = [];
  let metricValue: number | string = "";

  if (!isLoading) {
    metricValues?.push(queryData);
    console.log(queryData);
    metricValue = metricValues?.map(conversion)?.map((item) => Number(item.toFixed(fixedDecimals))) || "N/A";
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
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
