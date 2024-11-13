import mongoose from "mongoose";
import corn from "node-cron";
import { razorpayConfig } from "../config/razorpayConfig.js";
import { Booking } from "./booking.js";
import { Payment } from "./payment.js";
import { TIME_INTERVALS } from "../utils/interval.js";

const emiSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
    reminded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

corn.schedule(TIME_INTERVALS.EVERY_HOUR, async () => {
  const emis = await Emi.find({
    status: "PENDING",
    reminded: false,
    date: { $lt: new Date(), $ne: null },
  }).populate("bookingId");
  const razorpay = await razorpayConfig();
  for (const emi of emis) {
    try {
      const booking = await Booking.findById(emi.bookingId._id).populate(
        "travellerId"
      );
      const options = {
        amount: parseInt(parseFloat(emi.amount * 100)),
        currency: emi.currency,
        accept_partial: false,
        description: "Payment for Tour",
        customer: {
          name: booking?.travellerId?.fullName,
          contact: booking?.travellerId?.phone,
          email: booking?.travellerId?.email,
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        callback_url: process.env.BACKEND_URL + "/api/v1/payment/verify",
        callback_method: "get",
      };

      const link = await razorpay.paymentLink.create(options);

      await Payment.create({
        amount: emi.amount,
        currency: options.currency,
        paymentMethod: "ONLINE",
        razorpayOrderId: link.id,
        emiId: emi._id,
      });
      emi.reminded = true;
      await emi.save();
    } catch (error) {
      console.error(error);
    }
  }
});

export const Emi = mongoose.model("Emi", emiSchema);
