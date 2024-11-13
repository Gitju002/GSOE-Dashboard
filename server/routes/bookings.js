import express from "express";
import {
  addEmis,
  cancelBooking,
  createBooking,
  deleteBooking,
  deleteEmis,
  getSingleBookingById,
  updateBooking,
  updateEmis,
  getDirectBookings,
  getReferralBookings,
  changeBookingStatus,
} from "../controller/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.post("/add-emis", addEmis);
router.get("/get/direct", getDirectBookings);
router.get("/get/referral", getReferralBookings);
router.get("/get/:id", getSingleBookingById);
router.put("/update/:id", updateBooking);
router.put("/cancel/:bookingId", cancelBooking);
router.put("/change-status/:bookingId", changeBookingStatus);
router.delete("/delete/:bookingId", deleteBooking);
router.put("/update-emi/:emiId", updateEmis);
router.delete("/delete-emi/:id", deleteEmis);

export default router;
