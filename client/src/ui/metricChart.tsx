import Chart from 'react-apexcharts';
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricSeries } from "api";
import { convertMemToGb, convertMemToTb } from "utils";
import { Spinner, Box } from "@liftedinit/ui";

interface StatProps {
  label: string;
  xlabel?: string,
  ylabel?: string,
  metric: string;
  conversion?: Function;
  from?: string;
  to?: string;
  fixedDecimals?: number;
}

export function MetricChart({label, metric, conversion, from, to, xlabel, ylabel, fixedDecimals}: StatProps) {
  const { data: queryData, isLoading } = useQuery([metric + "series"], getManifestMetricSeries(metric,{from: from, to: to}));

  let chartData = {}

  if (!isLoading) {
    chartData = {
      options: {
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
          categories: queryData[0]?.slice() || [],
          labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MMM \'yy',
                day: 'dd MMM',
                hour: 'HH:mm',
            }
        }
        },
        colors: ["#38C7B4"],
        chart: { toolbar: { show: false } },
      },
      series: [
        {
          name: label,
          data: queryData[1]?.map(conversion)?.map((item) => Number(item.toFixed(fixedDecimals))) || []
        },
      ],
    };
  }

  return (
    <>
    {isLoading ? (
      <Spinner />
    ) : ( 
    <Chart type="line" series={chartData.series} options={chartData.options} />
    )}
    </>
  );
}
