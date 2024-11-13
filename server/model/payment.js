import mongoose from "mongoose";
import cron from 'node-cron';
import { TIME_INTERVALS } from "../utils/interval.js";


const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },

  razorpayOrderId: {
    type: String,
    required: true,
    unique: true,
  },

  emiId: {
    type: String,
    ref: "Emi",
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["ONLINE", "CASH"],
    required: true,
  },

  status: {
    type: String,
    enum: ["CREATED", "PAID", "FAILED"],
    default: "CREATED",
  },
},
{
  timestamps: true,
});

export const Payment = mongoose.model("Payment", paymentSchema);


cron.schedule(TIME_INTERVALS.EVERY_DAY_MIDNIGHT, async () => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  try {
    const result = await Payment.deleteMany({
      status: "CREATED",
      createdAt: { $lt: twentyFourHoursAgo }
    });
  } catch (err) {
    console.log(err);
  }
});


// {
//   "id": "pay_G3P9vcIhRs3NV4",
//   "entity": "payment",
//   "amount": 100,
//   "currency": "INR",
//   "status": "captured",
//   "order_id": "order_GjCr5oKh4AVC51",
//   "invoice_id": null,
//   "international": false,
//   "method": "card",
//   "amount_refunded": 0,
//   "refund_status": null,
//   "captured": true,
//   "description": "Payment for Adidas shoes",
//   "card_id": "card_KOdY30ajbuyOYN",
//   "bank": null,
//   "wallet": null,
//   "email": "gaurav.kumar@example.com",
//   "contact": "9000090000",
//   "customer_id": "cust_K6fNE0WJZWGqtN",
//   "token_id": "token_KOdY$DBYQOv08n",
//   "notes": [],
//   "fee": 1,
//   "tax": 0,
//   "error_code": null,
//   "error_description": null,
//   "error_source": null,
//   "error_step": null,
//   "error_reason": null,
//   "acquirer_data": {
//       "auth_code": "064381",
//       "arn": "74119663031031075351326",
//       "rrn": "303107535132"
//   },
//   "created_at": 1605871409
// }
