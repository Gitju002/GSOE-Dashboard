import { razorpayConfig } from "../config/razorpayConfig.js";
import { asyncErrorHandler, ErrorResponse } from "../middleware/error.js";
import { Payment } from "../model/payment.js";
import { Transaction } from "../model/transaction.js";
import { genrateCustomizedTransactionId } from "../utils/customized-id.js";
import { Emi } from "../model/emi.js";
import { Booking } from "../model/booking.js";
import { User } from "../model/user.js";
import cors from "cors";
import { Traveller } from "../model/traveller.js";
import { format } from "date-fns";
import { Agent } from "../model/agent.js";

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    emiId,
    paymentMethod = "ONLINE",
    currency = "INR",
    description = "Payment for tour!",
  } = req.body;

  const emi = await Emi.findById(emiId).populate({
    path: "bookingId",
    populate: {
      path: "travellerId",
    },
  });

  if (!emi) {
    return next(new ErrorResponse("Emi not found", 404));
  }

  if (emi.status === "PAID") {
    return next(new ErrorResponse("Emi already paid", 400));
  }

  let response = {};

  if (paymentMethod === "ONLINE") {
    const razorpay = paymentMethod === "ONLINE" ? await razorpayConfig() : null;

    const options =
      paymentMethod === "ONLINE"
        ? {
            amount: parseInt(Number(emi.amount) * 100),
            currency,
            accept_partial: false,
            description,
            customer: {
              name: emi.bookingId.travellerId.fullName,
              contact: emi.bookingId.travellerId.phone,
              email: emi.bookingId.travellerId.email,
            },
            notify: {
              sms: paymentMethod === "ONLINE" ? true : false,
              email: paymentMethod === "ONLINE" ? true : false,
            },
            reminder_enable: true,
            callback_url: process.env.BACKEND_URL + "/api/v1/payment/verify",

            callback_method: "get",
          }
        : null;

    const link =
      paymentMethod === "ONLINE"
        ? await razorpay.paymentLink.create(options)
        : null;
    response = link;

    await Payment.create({
      amount: emi.amount,
      currency: options.currency,
      paymentMethod,
      razorpayOrderId: link.id,
      emiId: emi._id,
    });
  }

  if (paymentMethod === "CASH") {
    const _id = await genrateCustomizedTransactionId();
    const transaction = await Transaction.create({
      _id,
      bookingId: emi.bookingId,
      currency: "INR",
      amount: emi.amount,
      paymentMethod: "CASH",
      transactionType: "CREDIT",
    });
    response = transaction;
    await Emi.findByIdAndUpdate(emi._id, { status: "PAID" });
    await Booking.findByIdAndUpdate(emi.bookingId, {
      $inc: { paidAmount: emi.amount },
    });
  }

  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const verifyPayment = asyncErrorHandler(async (req, res, next) => {
  cors({
    origin: "https://api.razorpay.com",
  });

  const {
    razorpay_payment_id,
    razorpay_payment_link_id,
    razorpay_payment_link_status,
  } = req.query;

  if (razorpay_payment_link_status !== "paid") {
    await Payment.findByIdAndUpdate(
      { razorpayOrderId: razorpay_payment_link_id },
      { status: razorpay_payment_link_status.toUpperCase() }
    );
    return next(new ErrorResponse("Payment Failed", 400));
  }

  const order = await Payment.findOne({
    razorpayOrderId: razorpay_payment_link_id,
  }).populate({
    path: "emiId",
    populate: {
      path: "bookingId",
    },
  });

  if (!order) {
    return next(new ErrorResponse("Order not found", 404));
  }

  order.status = razorpay_payment_link_status.toUpperCase();
  await order.save();

  await Emi.findByIdAndUpdate(order.emiId, { status: order.status });
  await Booking.findByIdAndUpdate(order.emiId.bookingId, {
    $inc: { paidAmount: order.amount },
  });

  const transaction_id = await genrateCustomizedTransactionId();

  await Transaction.create({
    _id: transaction_id,
    bookingId: order.emiId.bookingId,
    currency: order.currency,
    amount: order.amount,
    paymentMethod: order.paymentMethod,
    razorpayPaymentId: razorpay_payment_id,
    transactionType: "CREDIT",
  });

  const formattedDate = format(new Date(), "MM/dd/yyyy"); // Format the date

  return res.redirect(
    `${process.env.FRONTEND_URL}/thank-you?orderNumber=${encodeURIComponent(
      order._id
    )}&amount=${encodeURIComponent(order.amount)}&date=${encodeURIComponent(
      formattedDate
    )}`
  );
});

export const refundPayment = asyncErrorHandler(async (req, res, next) => {
  const transactionId = await genrateCustomizedTransactionId();
  const { bookingId, amount, paymentMethod } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }
  const bookingEmis = await booking.populate("emis");

  if (!bookingEmis.emis) {
    return next(new ErrorResponse("Emis not found", 404));
  }

  const Transactions = await Transaction.find({
    bookingId,
  });
  const creditTransactions = Transactions.filter(
    (transaction) =>
      transaction.transactionType === "CREDIT" && transaction.status === true
  );
  if (creditTransactions.length === 0) {
    return next(new ErrorResponse("No payment found", 400));
  }
  const refundTransactions = Transactions.filter(
    (transaction) => transaction.transactionType === "REFUND"
  );
  const paidAmount = creditTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  if (paidAmount === 0) {
    return next(new ErrorResponse("No payment found", 400));
  }
  const totalRefund = refundTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  if (totalRefund + amount > paidAmount) {
    return next(
      new ErrorResponse(
        "Amount must be less than or equals to paid amount",
        400
      )
    );
  }
  if (paymentMethod === "CREDIT_NOTE") {
    console.log(booking.travellerId);
    const user = await Traveller.findByIdAndUpdate(
      booking.travellerId,
      {
        $inc: { refund: amount },
      },
      { new: true }
    );
    if (!user) {
      return next(new ErrorResponse("Traveller not found", 404));
    }
  }

  const refund = await Transaction.create({
    _id: transactionId,
    bookingId,
    currency: "INR",
    amount,
    paymentMethod,
    transactionType: "REFUND",
    status: true,
  });
  booking.paidAmount -= amount;
  booking.amount -= amount;
  await booking.save();
  if (booking.status === "COMPLETED") {
    await Agent.findByIdAndUpdate(booking.agentId, {
      $inc: { coins: -amount * Number(process.env.COMMISSION) },
    });
  }
  return res.status(200).json({
    success: true,
    message: "Refund Processed",
    data: refund,
  });
});
