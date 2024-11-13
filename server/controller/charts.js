import { asyncErrorHandler, ErrorResponse } from "../middleware/error.js";
import { Traveller } from "../model/traveller.js";
import { Transaction } from "../model/transaction.js";
import { Booking } from "../model/booking.js";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  parseISO,
  isValid,
} from "date-fns";

// Helper function to parse and validate dates
const parseAndValidateDate = (dateString) => {
  const date = parseISO(dateString);
  if (!isValid(date)) throw new Error("Invalid date format");
  return date;
};

export const getRevenueWithProfit = asyncErrorHandler(
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;

      // Check if start and end dates are provided
      if (!startDate || !endDate) {
        return next(
          new ErrorResponse("Please provide start date and end date", 400)
        );
      }

      // Parse and validate the date inputs
      const inputStartDate = parseAndValidateDate(startDate);
      const inputEndDate = parseAndValidateDate(endDate);

      // Set start and end dates to cover the entire month
      const currentStartDate = startOfMonth(inputStartDate);
      const currentEndDate = endOfMonth(inputEndDate);

      // Set previous month's start and end dates
      const previousStartDate = startOfMonth(subMonths(currentStartDate, 1));
      const previousEndDate = endOfMonth(subMonths(currentStartDate, 1));

      // Helper function to match transactions within date range and criteria
      const matchTransactions = (start, end) => ({
        createdAt: { $gte: start, $lt: end },
        transactionType: "CREDIT",
        status: true,
      });

      // Function to aggregate revenue or profit within date range
      const aggregateRevenueOrProfit = async (start, end) => {
        const result = await Transaction.aggregate([
          { $match: matchTransactions(start, end) },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ]);
        return result[0]?.totalAmount || 0; // Return 0 if no data found
      };

      // Fetch current and previous month revenue and profit
      const [currentTotalRevenue, previousTotalRevenue] = await Promise.all([
        aggregateRevenueOrProfit(currentStartDate, currentEndDate),
        aggregateRevenueOrProfit(previousStartDate, previousEndDate),
      ]);

      return res.status(200).json({
        currentMonth: {
          totalRevenue: currentTotalRevenue,
          totalProfit: currentTotalRevenue, // Assuming profit is equivalent to revenue here for simplicity
        },
        previousMonth: {
          totalRevenue: previousTotalRevenue,
          totalProfit: previousTotalRevenue, // Assuming profit is equivalent to revenue here for simplicity
        },
      });
    } catch (error) {
      logger.error(error);
      return next(new ErrorResponse("Error fetching revenue data", 500));
    }
  }
);

export const getTravellerData = asyncErrorHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new ErrorResponse("Please provide start date and end date", 400)
    );
  }

  const currentStartDate = parseAndValidateDate(startDate);
  const currentEndDate = addDays(parseAndValidateDate(endDate), 1); // end date + 1 for inclusive range

  try {
    const travellerData = await Traveller.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentStartDate,
            $lt: currentEndDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: travellerData,
    });
  } catch (error) {
    return next(new ErrorResponse("Error fetching traveller data", 500));
  }
});

export const getBookingData = asyncErrorHandler(async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(
        new ErrorResponse("Please provide start date and end date", 400)
      );
    }

    const currentStartDate = parseAndValidateDate(startDate);
    const currentEndDate = addDays(parseAndValidateDate(endDate), 1);

    const findBookingsByType = async (type) => {
      return Booking.find({
        createdAt: { $gte: currentStartDate, $lte: currentEndDate },
        bookingType: type,
      });
    };

    const [referralBookings, directBookings] = await Promise.all([
      findBookingsByType("REFERRAL"),
      findBookingsByType("DIRECT"),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        referralBookings,
        directBookings,
      },
    });
  } catch (error) {
    return next(new ErrorResponse("Error fetching booking data", 500));
  }
});

export const getProfitPercentage = asyncErrorHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new ErrorResponse("Please provide start date and end date", 400)
    );
  }

  const currentStartDate = parseAndValidateDate(startDate);
  const currentEndDate = parseAndValidateDate(endDate);

  const previousStartDate = startOfMonth(subMonths(currentStartDate, 1));
  const previousEndDate = endOfMonth(subMonths(currentStartDate, 1));

  const getProfitPercentage = async (start, end) => {
    return Booking.find({
      createdAt: { $gte: start, $lt: end },
    }).select("profitPercentage");
  };

  const [currentProfitPercentage, previousProfitPercentage] = await Promise.all(
    [
      getProfitPercentage(currentStartDate, currentEndDate),
      getProfitPercentage(previousStartDate, previousEndDate),
    ]
  );

  return res.status(200).json({
    currentMonth: currentProfitPercentage,
    previousMonth: previousProfitPercentage,
  });
});
