import { z } from "zod";

export const userRegisterSchema = z.object({
  fullName: z
    .string({ success: false, message: "Full name must be a string" })
    .min(5, {
      success: false,
      message: "Full name should have at least 5 characters",
    })
    .max(50, {
      success: false,
      message: "Full name should have at most 50 characters",
    })
    .trim(),
  email: z
    .string({
      success: false,
      message: "Email must be a string",
    })
    .email({
      success: false,
      message: "Invalid email format",
    })
    .trim(),
  password: z
    .string({
      success: false,
      message: "Password must be a string",
    })
    .min(8, {
      success: false,
      message: "Password should have at least 8 characters",
    })
    .max(50, {
      success: false,
      message: "Password should have at most 50 characters",
    })
    .trim(),
  phone: z
    .string({
      required_error: "Phone must be a string",
    })
    .min(10, {
      success: false,
      message: "Phone should have at least 10 characters",
    })
    .trim()
    .optional(),
  role: z
    .string()
    .trim()
    .refine((val) => ["OPERATOR", "ACCOUNTS"].includes(val), {
      success: false,
      message: "Invalid role",
    }),
});

export const userLoginSchema = z.object({
  email: z
    .string({
      success: false,
      message: "Email must be a string",
    })
    .email({
      success: false,
      message: "Invalid email format",
    })
    .trim(),
  password: z
    .string({
      success: false,
      message: "Password must be a string",
    })
    .trim(),
});
