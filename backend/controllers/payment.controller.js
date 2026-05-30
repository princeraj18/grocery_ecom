import { stripe } from "../config/stripe.js";

import Payment from "../models/payment.model.js";

import Order from "../models/Order.model.js";

import mongoose from "mongoose";
import { sendInvoiceEmail } from "../utils/emailService.js";
import {
  reduceOrderStock,
  validateOrderStock,
} from "../utils/stock.js";
// ===================================
// CREATE STRIPE CHECKOUT SESSION
// ===================================
export const createCheckoutSession = async (
  req,
  res
) => {
  try {
    const {
      cartItems,
      totalAmount,
      userId,
      shippingAddress,
    } = req.body;

    // Validation
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    // ===================================
    // CREATE ORDER
    // ===================================
    const orderItems = cartItems.map((item) => {
      const rawProd = item.productId || item._id;
      const isObjectId = rawProd && mongoose.Types.ObjectId.isValid(rawProd);

      const out = {
        name: item.name,
        image: Array.isArray(item.image) ? item.image[0] : item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
        variant:
          item.variantId ||
          item.variant ||
          undefined,
        variantSize:
          item.variantSize ||
          item.size,
      };

      if (isObjectId) out.product = rawProd;
      else if (rawProd) out.clientId = rawProd;

      return out;
    });

    await validateOrderStock(
      orderItems
    );

    const order = await Order.create({
      user: userId,

      items: orderItems,

      shippingAddress,

      totalAmount: Number(totalAmount),

      // Order model accepts "COD" or "Online"
      paymentMethod: "Online",

      paymentStatus: "Pending",

      orderStatus: "Order Placed",
    });

    // ===================================
    // STRIPE LINE ITEMS
    // ===================================
    const lineItems = cartItems.map(
      (item) => ({
        price_data: {
          currency: "inr",

          product_data: {
            name: item.name,
          },

          unit_amount:
            Number(item.price) * 100,
        },

        quantity: item.quantity,
      })
    );

    // ===================================
    // CREATE STRIPE SESSION
    // ===================================
    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        line_items: lineItems,

        mode: "payment",

        success_url:
          "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",

        cancel_url:
          "http://localhost:5173/payment-cancel",
      });

    // ===================================
    // SAVE PAYMENT
    // ===================================
    await Payment.create({
      user: userId,

      order: order._id,

      paymentId: session.id,

      transactionId: session.payment_intent,

      amount: Number(totalAmount),

      currency: "INR",

      paymentMethod: "Stripe",

      paymentStatus: "Pending",
    });

    res.status(200).json({
      success: true,

      url: session.url,

      orderId: order._id,
    });
  } catch (error) {
    console.log(
      "CREATE SESSION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// VERIFY PAYMENT
// ===================================
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID required",
      });
    }

    // Retrieve Stripe Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Payment Successful
    if (session.payment_status === "paid") {
      // Update Payment Documentation Matrix
      const payment = await Payment.findOneAndUpdate(
        { paymentId: session.id },
        {
          paymentStatus: "Success",
          transactionId: session.payment_intent,
        },
        { new: true }
      );

      // Update Order Target
      if (payment) {
        const updatedOrder =
  await Order.findByIdAndUpdate(
    payment.order,
    {
      paymentStatus: "Paid",
      isPaid: true,
      orderStatus: "Processing",
    },
    {
      new: true,
    }
  );

        if (updatedOrder) {
          await reduceOrderStock(
            updatedOrder
          );
        }

        // =========================================================================
        // AUTOMATED HOOK RUNS IN background PROCESS (Prevents blocking Client response paths)
        // =========================================================================
      if (
  updatedOrder &&
  updatedOrder.shippingAddress?.email
) {
sendInvoiceEmail(updatedOrder)
  .then(() =>
    console.log("Invoice Sent")
  )
  .catch((err) =>
    console.log(
      "Invoice Error:",
      err.message
    )
  );}
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment not completed",
    });
  } catch (error) {
    console.log("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
