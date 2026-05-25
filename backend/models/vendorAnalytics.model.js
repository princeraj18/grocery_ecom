import mongoose from "mongoose";

const vendorAnalyticsSchema =
  new mongoose.Schema(
    {
      vendor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
        unique: true,
      },

      totalRevenue: {
        type: Number,
        default: 0,
      },

      totalOrders: {
        type: Number,
        default: 0,
      },

      totalProducts: {
        type: Number,
        default: 0,
      },

      totalCustomers: {
        type: Number,
        default: 0,
      },

      deliveredOrders: {
        type: Number,
        default: 0,
      },

      pendingOrders: {
        type: Number,
        default: 0,
      },

      cancelledOrders: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const VendorAnalytics =
  mongoose.models.VendorAnalytics ||
  mongoose.model(
    "VendorAnalytics",
    vendorAnalyticsSchema
  );

export default VendorAnalytics;