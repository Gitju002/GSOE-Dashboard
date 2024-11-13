import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
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

const PieChartComponent = ({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  const totalVisitors = React.useMemo(() => {
    return safeData.reduce((acc, curr) => acc + (curr.visitors || 0), 0);
  }, [safeData]);

  console.log("PieChartComponent -> safeData", safeData);

  return (
    <>
      {totalVisitors > 0 ? (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Journey Status Count</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={safeData}
                  dataKey="visitors"
                  nameKey="browser"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={5}
                  labelLine={false}
                >
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
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Tours
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total tours for the last 12 months
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div className="h-full w-full flex justify-center items-center border border-zinc-500 rounded-md">
          <h2 className="text-center text-2xl text-muted-foreground">
            No data available
          </h2>
        </div>
      )}
    </>
  );
};

export default PieChartComponent;
