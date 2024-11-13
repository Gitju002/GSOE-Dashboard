import { asyncErrorHandler, ErrorResponse } from "../middleware/error.js";
import { Emi } from "../model/emi.js";
import { Transaction } from "../model/transaction.js";

export const getTransaction = asyncErrorHandler(async (req, res, next) => {
  const {
    page = 1,
    limit,
    search = "",
    startTimeStamp,
    endTimeStamp,
    sortBy = "desc",
    transactionType,
  } = req.query;

  const start = startTimeStamp ? new Date(startTimeStamp) : new Date(0);
  const end = endTimeStamp ? new Date(endTimeStamp) : new Date();

  const queryConditions = [
    {
      $or: [
        { bookingId: { $regex: search.trim(), $options: "i" } },
        { razorpayPaymentId: { $regex: search.trim(), $options: "i" } },
        { _id: { $regex: search.trim(), $options: "i" } },
      ],
    },
    {
      createdAt: { $gt: start, $lt: end },
    },
  ];

  if (transactionType) {
    queryConditions.push({ transactionType });
  }

  const query = Transaction.find({
    $and: queryConditions,
  })
    .sort({ createdAt: sortBy === "asc" ? 1 : -1 })
    .populate("bookingId");

  if (!search) {
    query.skip((page - 1) * limit).limit(limit);
  }

  const transactions = await query.exec();

  if (!transactions.length) {
    return next(new ErrorResponse("No transactions found", 404));
  }

  const totalPage = await Transaction.countDocuments({
    $and: queryConditions,
  });

  return res.status(200).json({
    success: true,
    data: transactions,
    totalPage,
    message: "Transactions fetched successfully",
  });
});

export const paymentVerificationData = asyncErrorHandler(
  async (req, res, next) => {
    const { transactionId } = req.query;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return next(new ErrorResponse("Transaction not found", 404));
    }
    const razorpay = await razorpayConfig();
    const payment = await razorpay.payments.fetch(transaction.razorpayOrderId);
    return res.status(200).json({
      success: true,
      data: payment,
      message: "Payment fetched successfully",
    });
  }
);

export const verifyTransaction = asyncErrorHandler(async (req, res, next) => {
  const { transactionId, verify } = req.body;
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return next(new ErrorResponse("Transaction not found", 404));
  }
  transaction.status = verify;
  await transaction.save();
  return res.status(200).json({
    success: true,
    data: transaction,
    message: "Transaction verified successfully",
  });
});

export const getPayments = asyncErrorHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const transactions = await Emi.find({ bookingId });
  if (!transactions) {
    return next(new ErrorResponse("No transactions found", 404));
  }
  return res.status(200).json({
    success: true,
    data: transactions,
    message: "Payments fetched successfully",
  });
});
