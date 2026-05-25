import mongoose from "mongoose";

const couponSchema =
  new mongoose.Schema(
    {
      vendor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
      },

      code: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        trim: true,
      },

      discountType: {
        type: String,
        enum: [
          "percentage",
          "fixed",
        ],
        default: "percentage",
      },

      discountValue: {
        type: Number,
        required: true,
      },

      minOrderAmount: {
        type: Number,
        default: 0,
      },

      maxDiscount: {
        type: Number,
        default: 0,
      },

      expiryDate: {
        type: Date,
        required: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
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