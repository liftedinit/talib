import React from "react"
import Chart from 'react-apexcharts';
import { useQuery } from "@tanstack/react-query";
import { getMetricSeries, getMetricTransformSeries } from "api";
import { 
  Center,
  Spinner, 
  Box,
  Text 
} from "@liftedinit/ui";
import { useBgColor, LONG_STALE_INTERVAL, LONG_REFRESH_INTERVAL } from "utils";

interface StatProps {
  label: string;
  type: any;
  xtitle?: string,
  ytitle?: string,
  metric: string;
  conversion?: Function;
  from?: string;
  to?: string;
  smoothed?: boolean;
  windowsize?: number;
  fixedDecimals?: number;
  transform?: string;
  stroke?: string;
  height?: string | string[];
}

interface ChartData {
  series: { name: string; data: number[] }[];
  options: any;
}

interface QueryData {
  timestamps: (number|string)[];
  data: number[];
}

export function MetricChart({
  label, 
  type, 
  metric, 
  conversion, 
  from, 
  to, 
  smoothed = true,
  windowsize,
  xtitle, 
  ytitle, 
  fixedDecimals,
  transform,
  stroke,
  height,
}: StatProps) {

  type metricQueryFunction = () => void;

  let metricQuery: metricQueryFunction;

  if (transform) {
    metricQuery = getMetricTransformSeries(metric, transform, {from: from, to: to })
    }
  else {
    metricQuery = getMetricSeries(metric, smoothed, windowsize, {from: from, to: to })
  }

  const { data: queryData, isError, isLoading } = useQuery([metric + "series"], metricQuery, {
    staleTime: LONG_STALE_INTERVAL,
    refetchInterval: LONG_REFRESH_INTERVAL,
  });

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

  const bg = useBgColor();

  // Define default height if not provided
  if (!height) {
    height=["200px", "300px", "400px"]
  }

  if (!isLoading && queryData) {

    // Apply type to destructured queryData
    const typedData: QueryData = queryData[0]

    categoriesData = typedData.timestamps;
    seriesData = typedData.data;

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
        chart: { 
          toolbar: { show: false }, 
          animations: { enabled: false },
        },
        stroke: {
          curve: stroke ? stroke : 'smooth',
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
    <Box p={4} bg={bg}>
      <Center>
        <Spinner />
      </Center>
    </Box>
    ) : ( 
    <Box p={4} bg={bg} h={height}>
      <Chart height="100%" type={type} series={chartData.series} options={chartData.options} className="talib-chart" />
    </Box>
    )}
    {isError && (
      <Box p={4} mt={10} bg={bg}>
        <Center>
          <Text color="brand.teal" fontWeight="bold">Error loading chart data</Text>
        </Center>
      </Box>
    )}
    </>
  );
}

export const MemoizedMetricChart = React.memo(MetricChart);
