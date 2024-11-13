import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
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
    currency: {
      type: String,
      default: "INR",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      // required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    transactionType: {
      type: String,
      enum: ["CREDIT", "REFUND"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
