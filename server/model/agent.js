import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
  },
  coins: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Agent = mongoose.model("Agent", agentSchema);
