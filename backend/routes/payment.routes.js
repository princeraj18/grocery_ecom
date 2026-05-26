import express from "express";
import Order from "../models/Order.model.js";
import { sendInvoiceEmail } from "../utils/emailService.js";
import {
  createCheckoutSession,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  createCheckoutSession
);

router.post(
  "/verify-payment",
  verifyPayment
);
router.get("/test-email", async (req, res) => {
  const order = await Order.findOne();

  await sendInvoiceEmail(order);

  res.send("Email Sent");
});
export default router;