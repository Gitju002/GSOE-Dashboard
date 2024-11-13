import express from "express";
import {
  getRevenueWithProfit,
  getTravellerData,
  getBookingData,
  getProfitPercentage,
} from "../controller/charts.js";

const router = express.Router();

router.get("/revenue", getRevenueWithProfit);
router.get("/travellers", getTravellerData);
router.get("/bookings", getBookingData);
router.get("/profit", getProfitPercentage);

export default router;
