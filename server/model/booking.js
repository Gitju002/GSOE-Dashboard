import mongoose from "mongoose";
import corn from "node-cron";
import { sendMail } from "../utils/services/mail-service.js";
import { TIME_INTERVALS } from "../utils/interval.js";
import { Agent } from "./agent.js";
import fs from "fs";

const bookingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    travellerId: {
      type: String,
      ref: "Traveller",
      required: true,
    },
    travellerName: {
      type: String,
    },
    agentName: {
      type: String,
    },
    bookingType: {
      type: String,
      enum: ["DIRECT", "REFERRAL"],
    },
    agentId: {
      type: String,
      ref: "Agent",
    },
    amount: {
      type: Number,
      required: true,
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    profitPercentage: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      required: true,
    },
    emis: [
      {
        type: String,
        ref: "Emi",
      },
    ],
    dueAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["CREATED", "STARTED", "COMPLETED", "CANCELLED"],
      default: "CREATED",
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    numberOfAdults: {
      type: Number,
      required: true,
    },
    numberOfChildren: {
      type: Number,
      required: true,
    },
    usedCreditNote: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

corn.schedule(TIME_INTERVALS.EVERY_HOUR, async () => {
  const bookings = await Booking.find({
    status: "CREATED",
    startDate: { $lte: new Date() },
  })
    .populate("travellerId")
    .populate("emis");

  bookings.forEach(async (booking) => {
    let isPaymentDone =
      booking.emis.every((emi) => emi.isPaid) && booking.dueAmount === 0;
    if (!isPaymentDone) {
      return;
    }
    booking.status = "STARTED";
    await booking.save();
    if (!booking?.travellerId?.email) return;
    sendMail(
      booking?.travellerId?.email,
      "Journey Started",
      "Your journey has been started! Have a safe and happy journey"
    );
  });
  const completeBooking = await Booking.find({
    status: { $nin: ["CREATED", "CANCELLED"] },
    endDate: { $lte: new Date() },
  }).populate("travellerId");
  completeBooking.forEach(async (booking) => {
    booking.status = "COMPLETED";
    await booking.save();
    const agent = await Agent.findByIdAndUpdate(
      booking.agentId,
      {
        $inc: {
          coins: Number(booking.amount) * Number(process.env.AGENT_COMMISSION),
        },
      },
      { new: true }
    );
    if (!booking?.travellerId?.email) return;
    // send mail to traveller
    let htmlContent = fs.readFileSync(
      "./utils/mail-body/update-booking-mail.html",
      "utf8"
    );
    htmlContent = htmlContent.replace(
      /\$\{travellerName\}/g,
      booking.travellerId.fullName
    );
    htmlContent = htmlContent.replace(
      /\$\{bookingStatus\}/g,
      booking.status.toLowerCase()
    );
    await sendMail({
      from: process.env.MAIL_ID,
      to: booking.travellerId.email,
      subject: "Booking Updated",
      html: htmlContent,
    });
    if (!agent?.email) return;
    htmlContent = fs.readFileSync(
      "./utils/mail-body/update-booking-mail.html",
      "utf8"
    );
    htmlContent = htmlContent.replace(
      /\$\{travellerName\}/g,
      booking.travellerId.fullName
    );
    htmlContent = htmlContent.replace(
      /\$\{bookingStatus\}/g,
      booking.status.toLowerCase()
    );
    await sendMail({
      from: process.env.MAIL_ID,
      to: booking.travellerId.email,
      subject: "Booking Updated",
      html: htmlContent,
    });
  });
});

export const Booking = mongoose.model("Booking", bookingSchema);
