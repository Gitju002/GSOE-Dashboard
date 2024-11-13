import { z } from "zod";

export const bookingSchema = z.object({
  amount: z
    .number({
      success: false,
      message: "Amount must be a number",
    })
    .positive({
      success: false,
      message: "Amount must be a positive number",
    }),
  startDate: z
    .date({
      success: false,
      message: "Start date must be a Date",
    })
    .trim(),
  endDate: z
    .date({
      success: false,
      message: "End date must be a Date",
    })
    .trim(),
  venue: z
    .string({
      success: false,
      message: "Venue must be a string",
    })
    .min(5, {
      success: false,
      message: "Venue should have at least 5 characters",
    })
    .max(50, {
      success: false,
      message: "Venue should have at most 50 characters",
    })
    .trim(),
  packageType: z
    .string({
      success: false,
      message: "Package type must be a string",
    })
    .trim(),
});
