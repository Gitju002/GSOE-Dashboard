import { z } from "zod";

// Common phone number validation function
const phoneNumberValidation = z
  .string({
    success: false,
    message: "Phone number must be a string",
  })
  .min(10, {
    success: false,
    message: "Phone number should have at least 10 digits",
  })
  .max(15, {
    success: false,
    message: "Phone number should have at most 15 digits",
  });

export const travellerSchemaValidation = z.object({
  fullName: z
    .string({
      success: false,
      message: "Full name must be a string",
    })
    .min(5, {
      success: false,
      message: "Full name should have at least 5 characters",
    })
    .max(50, {
      success: false,
      message: "Full name should have at most 50 characters",
    }),
  email: z
    .string({
      success: false,
      message: "Email must be a string",
    })
    .email({
      success: false,
      message: "Invalid email format",
    }),
  phone: phoneNumberValidation,
});

export const travellerSchemaValidationUpdate = z.object({
  fullName: z
    .string({
      success: false,
      message: "Full name must be a string",
    })
    .min(5, {
      success: false,
      message: "Full name should have at least 5 characters",
    })
    .max(50, {
      success: false,
      message: "Full name should have at most 50 characters",
    })
    .trim()
    .optional(),
  email: z
    .string({
      success: false,
      message: "Email must be a string",
    })
    .email({
      success: false,
      message: "Invalid email format",
    })
    .trim()
    .optional(),
  phone: phoneNumberValidation.optional(),
});
