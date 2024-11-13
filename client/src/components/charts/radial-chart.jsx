import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "A radial chart with a custom shape";
const chartData = [
  { browser: "safari", bookings: 1260, fill: "var(--color-safari)" },
];
const chartConfig = {
  visitors: {
    label: "Bookings",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
};

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
    return "Showing data for one day";
  } else if (daysDifference === 1) {
    return `Showing data for 2 days`;
  } else {
    return `Showing data for the last ${daysDifference + 1} days`;
  }
}

export function RadialChart({ data, startDate, endDate }) {
  const referralChartData = useMemo(() => {
    if (!data) return [{ bookings: 0 }];
    if (data?.referralBookings?.length === 0) return [{ bookings: 0 }];
    return [{ bookings: data?.referralBookings?.length || 0 }];
  }, [data]);

  const directChartData = useMemo(() => {
    if (!data) return [{ bookings: 0 }];
    if (data?.directBookings?.length === 0) return [{ bookings: 0 }];
    return [{ bookings: data?.directBookings?.length || 0 }];
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Bookings</CardTitle>
        <CardDescription>
          {formatDateRangeText(startDate, endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-1/2"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="bookings" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {referralChartData[0].bookings.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Referral Bookings
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-1/2"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="bookings" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {directChartData[0].bookings.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Direct Bookings
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
