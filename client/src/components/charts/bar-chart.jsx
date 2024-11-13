import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart with traveller data";

const chartConfig = {
  traveller: {
    label: "Travellers",
    color: "hsl(var(--chart-1))",
  },
};

export function BarChartComponent({ startDate, endDate, chartData }) {
  const totalTraveller = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + (curr.count || 0), 0),
    [chartData]
  );

  const formattedChartData = React.useMemo(() => {
    const data = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const dataPoint = chartData.find((d) => d._id === dateStr) || {
        _id: dateStr,
        count: 0,
      };
      data.push(dataPoint);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  }, [chartData, startDate, endDate]);

  // Format the date range text
  function formatDateRangeText(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (
      start.toDateString() === today.toDateString() &&
      end.toDateString() === today.toDateString()
    ) {
      return "Showing today's data";
    }

    const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      return `Showing data for one day`;
    } else if (daysDifference === 1) {
      return `Showing data for 2 days`;
    } else {
      return `Showing data for the last ${daysDifference + 1} days`;
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Traveller Data</CardTitle>
          <CardDescription>
            {formatDateRangeText(startDate, endDate)}
          </CardDescription>
        </div>
        <div className="flex">
          <button
            data-active={true}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">
              {chartConfig.traveller.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalTraveller.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={formattedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="_id"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              minTickGap={16}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="count"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="count" fill="var(--color-traveller)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
