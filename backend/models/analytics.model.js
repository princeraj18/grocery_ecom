import mongoose from "mongoose";

const analyticsSchema =
  new mongoose.Schema(
    {
      totalUsers: {
        type: Number,
        default: 0,
      },

      totalVendors: {
        type: Number,
        default: 0,
      },

      totalProducts: {
        type: Number,
        default: 0,
      },

      totalOrders: {
        type: Number,
        default: 0,
      },

      totalRevenue: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const Analytics =
  mongoose.models.Analytics ||
  mongoose.model(
    "Analytics",
    analyticsSchema
  );

export default Analytics;