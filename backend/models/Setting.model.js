import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    // Platform Meta
    siteName: { type: String, default: "ShopEase Grocery" },
    supportEmail: { type: String, default: "support@shopease.com" },
    isMaintenanceMode: { type: Boolean, default: false },
    currencySymbol: { type: String, default: "INR (₹)" },

    // Store Mechanics
    minOrderValue: { type: Number, default: 299 },
    taxPercentage: { type: Number, default: 5 },
    autoAssignDelivery: { type: Boolean, default: true },
    enableNotifications: { type: Boolean, default: true },

    // Logistics / Delivery Rules
    baseDeliveryFee: { type: Number, default: 40 },
    freeDeliveryThreshold: { type: Number, default: 999 },
    perKmSurcharge: { type: Number, default: 10 },
    maxDeliveryRadiusKm: { type: Number, default: 15 },

    // Gateways & Processing Flags
    enableCOD: { type: Boolean, default: true },
    enableOnlinePayment: { type: Boolean, default: true },
    testModeGateways: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;