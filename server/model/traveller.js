import mongoose from "mongoose";

const travellerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  refundType: {
    type: String,
    enum: ["CASH", "CREDIT_NOTE"],
  },
  refund: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Traveller = mongoose.model("Traveller", travellerSchema);
