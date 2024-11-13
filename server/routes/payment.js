import express from "express";
import auth from "../auth/auth.js";
import {
  createOrder,
  refundPayment,
  verifyPayment
} from "../controller/payment.js";

const router = express.Router();

router.get("/verify", verifyPayment);
router.post(
  "/create-order",
  auth.isAuthenticated,
  auth.isOperator,
  createOrder
);
router.post("/refund", auth.isAuthenticated, auth.isAccounts, refundPayment);

export default router;
