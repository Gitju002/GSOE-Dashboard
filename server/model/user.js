import mongoose from "mongoose";
import cron from "node-cron";

const userSchema = new mongoose.Schema(
  {
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "OPERATOR", "ACCOUNTS"],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastPasswordResetRequest: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

cron.schedule("0 * * * *", async () => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  try {
    const result = await User.deleteMany({
      verified: false,
      createdAt: { $lt: twentyFourHoursAgo },
    });
  } catch (err) {
    console.error("Error deleting unverified users:", err);
  }
});

export const User = mongoose.model("User", userSchema);
