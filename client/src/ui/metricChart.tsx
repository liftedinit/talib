import Chart from 'react-apexcharts';
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricSeries } from "api";
import { 
  Center,
  Spinner, 
  Box,   
} from "@liftedinit/ui";

interface StatProps {
  label: string;
  type: string;
  xtitle?: string,
  ytitle?: string,
  metric: string;
  conversion?: Function;
  from?: string;
  to?: string;
  fixedDecimals?: number;
  intervalMs?: number;
  maxDataPoints?: number;
}

export function MetricChart({
  label, 
  type, 
  metric, 
  conversion, 
  from, 
  to, 
  xtitle, 
  ytitle, 
  fixedDecimals,
  intervalMs,
  maxDataPoints,
}: StatProps) {
  const { data: queryData, isLoading } = useQuery([metric + "series"], getManifestMetricSeries(metric,{from: from, to: to, intervalMs: intervalMs, maxDataPoints: maxDataPoints}));
  let chartData = {}

  if (!isLoading) {
    chartData = {
      options: {
        colors: ["#38C7B4"],
        dataLabels: { enabled: false },
        chart: { toolbar: { show: false } },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          title: { 
            text: xtitle || "",
            style: {
              fontSize: "1.25em",
              fontFamily: "Rubik, sans-serif",
            },
          },
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
        yaxis: {
          title: { 
            text: ytitle || "",
            style: {
              fontSize: "1.25em",
              fontFamily: "Rubik, sans-serif",
            },
          },
        }
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
    <Box bg="white" p={4}>
      <Center>
        <Spinner />
      </Center>
    </Box>
    ) : ( 
    <Box bg="white" p={4}>
      <Chart type={type} series={chartData.series} options={chartData.options} />
    </Box>
    )}
    </>
  );
}
