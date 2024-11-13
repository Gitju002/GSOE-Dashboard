import { BarChartComponent } from "@/components/charts/bar-chart";
import { RadialChart } from "@/components/charts/radial-chart";
import Loader from "@/components/loader/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
import { formatAmount } from "@/lib/utils";
import {
  useGetAllTravllersQuery,
  useGetBookingsQuery,
  useGetProfitPercentageQuery,
  useGetRevenueWithProfitQuery,
} from "@/store/services/chart";
import { useMemo, useState } from "react";
import { format, subMonths } from "date-fns";

const MainDashboard = () => {
  const [startDate, setStartDate] = useState(
    format(subMonths(new Date(), 1), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: revenueWithProfit, isLoading: isRevenueWithProfitLoading } =
    useGetRevenueWithProfitQuery(
      {
        startDate: startDate,
        endDate: endDate,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: travellersData, isLoading: isTravellersDataLoading } =
    useGetAllTravllersQuery(
      {
        startDate: startDate,
        endDate: endDate,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: bookingsData, isLoading: isBookingsDataLoading } =
    useGetBookingsQuery(
      {
        startDate: startDate,
        endDate: endDate,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: profitPercentage, isLoading: isProfitPercentageLoading } =
    useGetProfitPercentageQuery(
      {
        startDate: startDate,
        endDate: endDate,
      },
      { refetchOnMountOrArgChange: true }
    );

  const percentageIncrease = useMemo(() => {
    if (!revenueWithProfit) return 0;

    const currentRevenue = revenueWithProfit.currentMonth.totalRevenue || 0;
    const previousRevenue = revenueWithProfit.previousMonth.totalRevenue || 0;

    if (previousRevenue > 0) {
      return (
        ((currentRevenue - previousRevenue) / previousRevenue) *
        100
      ).toFixed(2);
    } else if (previousRevenue === 0) {
      return "No previous data";
    }
    return 0;
  }, [revenueWithProfit]);

  const profit = useMemo(() => {
    if (!profitPercentage || !profitPercentage.currentMonth) return 0;

    return profitPercentage.currentMonth.reduce((acc, curr) => {
      return acc + Number(curr.profitPercentage || 0);
    }, 0);
  }, [profitPercentage]);

  if (
    isRevenueWithProfitLoading ||
    isTravellersDataLoading ||
    isBookingsDataLoading ||
    isProfitPercentageLoading
  ) {
    return <Loader />;
  }

  return (
    <section className="py-12 px-6 mx-auto min-h-screen container">
      <h1 className="p-2 text-6xl uppercase font-semibold flex justify-center">
        Analytics
      </h1>
      <h2 className="p-2 flex justify-center text-center">
        Customize Your Analytics View by Selecting a Date Range
      </h2>
      <div className="max-w-sm mx-auto">
        <div className="flex items-center gap-2">
          <p className="font-semibold">From</p>
          <DatePicker
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => {
              setStartDate(format(new Date(e), "yyyy-MM-dd"));
            }}
            dateFormats="dd/MM/yy"
          />
          <p className="font-semibold">To</p>
          <DatePicker
            placeholder="End Date"
            value={endDate}
            onChange={(e) => {
              setEndDate(format(new Date(e), "yyyy-MM-dd"));
            }}
            dateFormats="dd/MM/yy"
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 my-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                Total Revenue
              </CardTitle>
            </div>
            <CardDescription>
              {percentageIncrease === "No previous data"
                ? "No previous data to compare"
                : `${percentageIncrease}% increase in revenue from last month`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {formatAmount(revenueWithProfit.currentMonth.totalRevenue || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                Average Profit Percentage
              </CardTitle>
            </div>
            <CardDescription hidden>
              {profitPercentage.currentMonth.length} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {isNaN(Math.round(profit / profitPercentage.currentMonth.length))
                ? 0
                : Math.round(profit / profitPercentage.currentMonth.length)}
              %
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <BarChartComponent
          startDate={startDate}
          endDate={endDate}
          chartData={travellersData?.data || []}
        />
      </div>
      <div className="my-4">
        <RadialChart
          data={bookingsData?.data || []}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </section>
  );
};

export default MainDashboard;
