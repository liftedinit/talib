import Chart from 'react-apexcharts';
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricSeries, getManifestMetricTransformSeries } from "api";
import { 
  Center,
  Spinner, 
  Box,
  Text 
} from "@liftedinit/ui";

interface StatProps {
  label: string;
  type: any;
  xtitle?: string,
  ytitle?: string,
  metric: string;
  conversion?: Function;
  from?: string;
  to?: string;
  fixedDecimals?: number;
  intervalMs?: number;
  maxDataPoints?: number;
  transform?: string;
}

interface ChartData {
  series: { name: string; data: number[] }[];
  options: any;
}

interface queryData {
    timestamps: string[];
    data: number[];
};

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
  transform,
}: StatProps) {

  type metricQueryFunction = () => void;

  let metricQuery: metricQueryFunction;

  if (transform) {
    metricQuery = getManifestMetricTransformSeries(metric, transform, {from: from, to: to, intervalMs: intervalMs, maxDataPoints: maxDataPoints})
    }
  else {
    metricQuery = getManifestMetricSeries(metric,{from: from, to: to, intervalMs: intervalMs, maxDataPoints: maxDataPoints})
  }

  const { data: queryData, isError, isLoading } = useQuery([metric + "series"], metricQuery);
  let chartData: ChartData = {
    series: [] ,
    options: undefined
  }

  let categoriesData: (number|string)[] = []
  let seriesData: number[] = []
  let formatData: number[] = []

  if (isError || !queryData) {
    categoriesData = [];
    seriesData = [];
  }

  if (!isLoading && queryData) {
    categoriesData = queryData[0].timestamps;
    seriesData = queryData[0].data;

    if (conversion && queryData != null) {
      formatData = seriesData
        .map((item: number, index: number, arr: number[]) => conversion(item, index, arr))
        ?.map((item: unknown) => Number((item as number)
        .toFixed(fixedDecimals))) || [];
    }
    else if (!conversion && queryData != null ) {
      formatData = seriesData
        .map((item: number) => Number((item)
        .toFixed(fixedDecimals))) || [];
    }
    else {
      formatData = [];
    }
    
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
          categories: categoriesData,
          labels: {
            overflow: 'scroll',
            datetimeFormatter: {
              year: 'yy',
              month: 'MMM',
              day: 'dd',
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
          data: formatData,
        },
      ],
    };
  }

  return (
    <>
    {isLoading || isError ? (
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
    {isError && (
      <Box bg="white" p={4} mt={10}>
        <Center>
          <Text color="brand.teal" fontWeight="bold">Error loading chart data</Text>
        </Center>
      </Box>
    )}
    </>
  );
}