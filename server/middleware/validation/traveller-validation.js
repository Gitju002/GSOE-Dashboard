import { travellerSchemaValidation, travellerSchemaValidationUpdate } from "../../utils/validation-schema/traveller-schema-validation.js";

export const travellerValidation = (req, res, next) => {
  try {
    travellerSchemaValidation.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};
// traveller validation on update
export const travellerValidationUpdate = (req, res, next) => {
  try {
    travellerSchemaValidationUpdate.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};
