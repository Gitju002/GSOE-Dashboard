import { agentSchemaValidation, agentSchemaValidationUpdate } from "../../utils/validation-schema/agent-schema-validation.js";

export const agentValidation = async (req, res, next) => {
  try {
    agentSchemaValidation.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};

export const agentValidationUpdate = async (req, res, next) => {
  try {
    agentSchemaValidationUpdate.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};