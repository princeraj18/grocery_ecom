import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    paymentId: String,

    transactionId: String,

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String,
      enum: [
        "Stripe",
        "Razorpay",
        "COD",
      ],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Success",
        "Failed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  mongoose.models.Payment ||
  mongoose.model(
    "Payment",
    paymentSchema
  );

export default Payment;