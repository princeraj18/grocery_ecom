import mongoose from "mongoose";

const couponSchema =
  new mongoose.Schema(
    {
      code: String,

      discount: Number,

      expiryDate: Date,
    },
    {
      timestamps: true,
    }
  );

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model(
    "Coupon",
    couponSchema
  );

export default Coupon;