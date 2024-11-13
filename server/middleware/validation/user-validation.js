import {
  userLoginSchema,
  userRegisterSchema,
} from "../../utils/validation-schema/user-schema-validation.js";

export const registerUserValidation = (req, res, next) => {
  try {
    Object.keys(req.body).forEach(
      (key) =>
        (req.body[key] == null || req.body[key] == undefined) &&
        delete req.body[key]
    );
    userRegisterSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};

export const userLoginValidation = (req, res, next) => {
  try {
    userLoginSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};
