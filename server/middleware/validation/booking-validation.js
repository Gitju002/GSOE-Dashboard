import { bookingSchema } from "../../utils/validation-schema/booking-schema-validation";

export const bookingSchemaValidation = (req, res, next) => {
    try {
        bookingSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
        success: false,
        message: error.errors[0].message,
        });
    }
    };