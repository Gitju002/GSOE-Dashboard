import express from "express";
import auth from "../auth/auth.js";
import {
  getTransaction,
  paymentVerificationData,
  verifyTransaction,
} from "../controller/transaction.js";
import { getEmiData } from "../controller/booking.js";

const router = express.Router();

router.get("/get",auth.isAuthenticated, getTransaction);
router.get("/get-payments/:bookingId",auth.isAuthenticated,auth.isOperator, getEmiData);
router.get("/payment-verification-data",auth.isAuthenticated,auth.isAccounts, paymentVerificationData);
router.put("/verify-transaction",auth.isAuthenticated,auth.isAccounts, verifyTransaction);

export default router;
