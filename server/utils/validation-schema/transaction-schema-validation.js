import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number({
    success: false,
    message: "Amount must be a number",
  }).positive({
    success: false,
    message: "Amount must be a positive number",
  }),
  paymentMethod : z.string({
    success: false,
    message: "Payment method must be a string",
  }).trim(),
  status: z.boolean({
    success: false,
    message: "Status must be a boolean",
  }),
});