import { asyncErrorHandler, ErrorResponse } from "../middleware/error.js";
import { Agent } from "../model/agent.js";
import { Booking } from "../model/booking.js";
import { Emi } from "../model/emi.js";
import { Traveller } from "../model/traveller.js";
import { Transaction } from "../model/transaction.js";
import fs from "fs";
import {
  generateCustomizedEmiId,
  genrateCustomizedBookingId,
  genrateCustomizedTransactionId,
} from "../utils/customized-id.js";
import { sendMail } from "../utils/services/mail-service.js";

export const createBooking = asyncErrorHandler(async (req, res, next) => {
  const {
    travellerId,
    agentId,
    amount,
    startDate,
    endDate,
    venue,
    packageType,
    baseAmount,
    numberOfAdults,
    numberOfChildren,
  } = req.body;

  const existBooking = await Booking.findOne({
    travellerId,
    $or: [
      { startDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
      { endDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
      {
        startDate: { $lt: new Date(startDate) },
        endDate: { $gt: new Date(endDate) },
      },
    ],
  });

  if (existBooking) {
    return next(new ErrorResponse("Another booking already exists", 400));
  }

  if (startDate > endDate) {
    return next(
      new ErrorResponse("Start date should be less than end date", 400)
    );
  }
  if (new Date(endDate) < new Date()) {
    return next(
      new ErrorResponse("Journey end date should be after today's date", 400)
    );
  }

  if (numberOfAdults < 1 || numberOfChildren < 0) {
    return next(
      new ErrorResponse("Number of adults should be greater than 0", 400)
    );
  }

  let traveller = await Traveller.findById(travellerId);

  if (!traveller) {
    return next(new ErrorResponse("Traveller not found", 404));
  }

  let agent = null;

  if (agentId) {
    agent = await Agent.findById(agentId);
    if (!agent) {
      return next(new ErrorResponse("Agent not found", 404));
    }
  }

  let dueAmount = Number(amount);
  const bookingAmount = Number(amount);
  let creditNote = Number(traveller.refund);

  if (creditNote >= bookingAmount) {
    dueAmount = 0;
    traveller = await Traveller.findOneAndUpdate(
      { _id: travellerId },
      {
        $inc: { refund: -bookingAmount },
      },
      {
        new: true,
      }
    );
    creditNote = bookingAmount;
  } else {
    dueAmount = bookingAmount - creditNote;
    traveller = await Traveller.findOneAndUpdate(
      { _id: travellerId },
      {
        refund: 0,
      },
      {
        new: true,
      }
    );
  }

  if (Number(baseAmount) > Number(amount)) {
    return next(
      new ErrorResponse(
        "Base amount should be less than or equal to amount",
        400
      )
    );
  }

  const profitPercentage = ((amount - baseAmount) / baseAmount) * 100;

  const _id = await genrateCustomizedBookingId();

  const booking = await Booking.create({
    _id,
    travellerId,
    agentId,
    amount: Number(amount),
    startDate,
    endDate,
    venue,
    packageType,
    dueAmount,
    bookingType: agentId ? "REFERRAL" : "DIRECT",
    agentName: agentId ? agent.fullName : "",
    travellerName: traveller.fullName,
    paidAmount: creditNote,
    baseAmount,
    profitPercentage,
    numberOfAdults,
    numberOfChildren,
    usedCreditNote: creditNote,
  });

  if (creditNote > 0) {
    const transaction_id = await genrateCustomizedTransactionId();
    await Transaction.create({
      _id: transaction_id,
      bookingId: booking._id,
      currency: "INR",
      amount: creditNote,
      paymentMethod: "CREDIT_NOTE",
      razorpayPaymentId: null,
      transactionType: "CREDIT",
    });
  }

  let htmlContent = fs.readFileSync(
    "./utils/mail-body/confirm-booking-mail.html",
    "utf8"
  );
  htmlContent = htmlContent.replace(
    /\$\{travellerName\}/g,
    booking.travellerName
  );
  await sendMail({
    from: process.env.MAIL_ID,
    to: traveller.email,
    subject: "Booking Confirmation",
    html: htmlContent,
  });

  return res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
    traveller,
  });
});

export const addEmis = asyncErrorHandler(async (req, res, next) => {
  const { emi, bookingId } = req.body;

  if (!emi) {
    return next(new ErrorResponse("EMI details are required", 400));
  }

  if (!emi.amount || !emi.date) {
    return next(new ErrorResponse("Please fill all the fields", 400));
  }

  if (new Date(emi.date) < new Date()) {
    return next(
      new ErrorResponse("EMI date should be after today's date", 400)
    );
  }
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() + 2,
    today.getMonth(),
    today.getDate()
  );
  if (new Date(emi.date) > new Date(maxDate)) {
    return next(new ErrorResponse("EMI date should be within 2 years", 400));
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }

  if (booking.dueAmount === 0) {
    return next(new ErrorResponse("There is no due amount!", 400));
  }

  if (booking.dueAmount < emi.amount) {
    return next(
      new ErrorResponse("EMI Amount cannot be more than Due Amount!", 400)
    );
  }

  const _id = await generateCustomizedEmiId();

  const newEmi = await Emi.create({
    _id,
    bookingId,
    amount: emi.amount,
    date: emi.date,
    status: "PENDING",
  });

  booking.dueAmount -= emi.amount;
  booking.emis.push(newEmi._id);
  await booking.save();

  return res.status(201).json({
    success: true,
    data: newEmi,
  });
});

export const updateBooking = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { startDate, endDate, venue, packageType } = req.body;

  if (!startDate || !endDate || !venue || !packageType) {
    return next(new ErrorResponse("Please fill all the fields to update", 400));
  }
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }
  if (booking?.status !== "CREATED") {
    return next(
      new ErrorResponse(`Booking already ${booking?.status.toLowerCase()}`, 400)
    );
  }
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    {
      startDate,
      endDate,
      venue,
      packageType,
    },
    { new: true }
  ).populate("emis");

  return res.status(200).json({
    success: true,
    message: "Booking updated",
    data: updatedBooking,
  });
});

const createBookingQuery = (
  search,
  startTimeStamp,
  endTimeStamp,
  bookingType
) => {
  const start = startTimeStamp ? new Date(startTimeStamp) : undefined;
  const end = endTimeStamp ? new Date(endTimeStamp) : undefined;

  const query = {
    $or: [
      { _id: { $regex: search, $options: "i" } },
      { venue: { $regex: search, $options: "i" } },
      { packageType: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
      { travellerId: { $regex: search, $options: "i" } },
      { agentId: { $regex: search, $options: "i" } },
      { agentName: { $regex: search, $options: "i" } },
      { travellerName: { $regex: search, $options: "i" } },
    ],
    bookingType,
  };

  if (start && end) {
    query.createdAt = { $gt: start, $lt: end };
  }

  return query;
};

const getBookings = async (req, res, bookingType) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    startTimeStamp,
    endTimeStamp,
    sortBy = "desc",
  } = req.query;

  const query = createBookingQuery(
    search,
    startTimeStamp,
    endTimeStamp,
    bookingType
  );

  const totalBookings = await Booking.countDocuments(query);

  let bookingsQuery = Booking.find(query).sort({
    createdAt: sortBy === "asc" ? 1 : -1,
  });

  if (!search) {
    bookingsQuery = bookingsQuery.skip((page - 1) * limit).limit(limit);
  }

  const bookings = await bookingsQuery
    .populate({
      path: "travellerId",
      select: "fullName",
    })
    .populate({
      path: "agentId",
      select: "fullName",
    })
    .exec();

  if (!bookings.length) {
    return res.status(404).json({
      success: true,
      message: `No ${bookingType.toLowerCase()} bookings found`,
      data: {
        totalBookings,
        bookings: [],
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      totalBookings,
      bookings,
    },
  });
};

export const getReferralBookings = asyncErrorHandler(async (req, res, next) => {
  return getBookings(req, res, "REFERRAL");
});

export const getDirectBookings = asyncErrorHandler(async (req, res, next) => {
  return getBookings(req, res, "DIRECT");
});

export const deleteBooking = asyncErrorHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByIdAndDelete(bookingId);

  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Booking deleted",
  });
});

export const getSingleBookingById = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("emis")
      .populate("travellerId")
      .populate("agentId");
    if (!booking) {
      return next(new ErrorResponse("Booking not found", 404));
    }
    return res.status(200).json({
      success: true,
      data: booking,
    });
  }
);

export const getEmiData = asyncErrorHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const emi = await Emi.find({ bookingId });
  if (!emi) {
    return next(new ErrorResponse("No emi found", 404));
  }
  return res.status(200).json({
    success: true,
    data: emi,
  });
});

export const updateEmis = asyncErrorHandler(async (req, res, next) => {
  const { emiId } = req.params;
  const { amount, date } = req.body;

  if (!emiId) {
    return next(new ErrorResponse("Emi ID not found", 404));
  }

  if (!amount) {
    return next(new ErrorResponse("Amount is required", 400));
  }

  const emiData = await Emi.findById(emiId);

  if (!emiData) {
    return next(new ErrorResponse("EMI not found", 404));
  }

  if (emiData?.status === "PAID") {
    return next(new ErrorResponse("EMI already paid", 400));
  }

  const booking = await Booking.findById(emiData.bookingId);

  const newDueAmount = booking.dueAmount + emiData.amount - amount;

  if (newDueAmount < 0) {
    return next(
      new ErrorResponse("The new EMI amount exceeds the due amount", 400)
    );
  }

  booking.dueAmount = newDueAmount;

  emiData.amount = amount || emiData.amount;
  emiData.date = date || emiData.date;

  await emiData.save();
  await booking.save();

  return res.status(200).json({
    success: true,
    data: emiData,
  });
});

export const cancelBooking = asyncErrorHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }
  if (booking.status === "CREATED" || booking.status === "STARTED") {
    booking.status = "CANCELLED";
    await booking.save();
    return res.status(200).json({
      success: true,
      message: "Booking cancelled",
      data: booking,
    });
  } else {
    return next(new ErrorResponse(`Booking is already ${booking.status}`, 400));
  }
});

export const deleteEmis = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const emi = await Emi.findOne({ _id: id });

  if (!emi) {
    return next(new ErrorResponse("Emi not found", 404));
  }

  if (emi?.status === "PAID") {
    return next(new ErrorResponse("EMI already paid", 400));
  }

  const deletedEmi = await Emi.findByIdAndDelete(id);

  const booking = await Booking.findById(emi.bookingId);

  booking.dueAmount = booking.dueAmount + emi.amount;
  booking.emis = booking.emis.filter((emiId) => emiId.toString() !== id);

  await booking.save();

  return res.status(200).json({
    success: true,
    message: "Emi deleted",
    data: deletedEmi,
  });
});

export const changeBookingStatus = asyncErrorHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const booking = await Booking.findById(bookingId).populate("travellerId");
  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }
  if (booking.status === "COMPLETED") {
    return next(new ErrorResponse("Booking already completed", 400));
  }
  if (booking.status === status) {
    return next(
      new ErrorResponse(`Booking is already ${status.toLowerCase()}`, 400)
    );
  }
  booking.status = status;
  const updatedBooking = await booking.save();
  let htmlContent = fs.readFileSync(
    "./utils/mail-body/confirm-booking-mail.html",
    "utf8"
  );
  htmlContent = htmlContent.replace(
    /\$\{travellerName\}/g,
    booking.travellerName
  );
  await sendMail({
    from: process.env.MAIL_ID,
    to: traveller.email,
    subject: "Booking Confirmation",
    html: htmlContent,
  });
  return res.status(200).json({
    success: true,
    message: "Booking status updated",
    data: updatedBooking,
  });
});
