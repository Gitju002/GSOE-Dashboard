import { transactionSchema } from "../../utils/validation-schema/transaction-schema-validation";

export const transactionValidation = (req, res, next) => {
  try {
    transactionSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};
