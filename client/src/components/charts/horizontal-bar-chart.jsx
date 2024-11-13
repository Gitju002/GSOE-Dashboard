import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "coins",
  },
  chrome: {
    label: "AGT1",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "AGT2",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "AGT3",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "AGT4",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "AGT5",
    color: "hsl(var(--chart-5))",
  },
};

const HorizontalBarChartComponent = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error("Invalid data format. Expected an array.");
    return <div>Error: Invalid data format.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Coins Leaderboard</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value]?.label || value}
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing leaderboard of referral coins for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default HorizontalBarChartComponent;
