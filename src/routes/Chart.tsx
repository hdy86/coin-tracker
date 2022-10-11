import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { fetchCoinHistory } from "../api";
import { isDarkAtom } from "../atoms";

interface IHistorical {
  time_open: number;
  time_close: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumne: number;
  market_cap: number;
}
interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((price) => price.close) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              width: 500,
              height: 300,
              toolbar: { show: false },
              background: "transparent",
            },
            grid: { show: false },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
              type: "datetime",
              // categories: data?.map((price) => price.time_close) ?? [],
              categories:
                data?.map((price) =>
                  new Date(price.time_close * 1000).toISOString()
                ) ?? [],
            },
            yaxis: {
              show: false,
            },
            stroke: {
              curve: "smooth",
              width: 5,
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
          }}
        />
      )}
    </div>
  );
}

export default Chart;
