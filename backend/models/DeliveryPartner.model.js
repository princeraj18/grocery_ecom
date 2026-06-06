import mongoose from "mongoose";

const deliveryPartnerSchema =
  new mongoose.Schema(
    {
      // =====================================
      // BASIC DETAILS
      // =====================================

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      vehicleType: {
        type: String,
        enum: [
          "Bike",
          "Scooter",
          "Car",
          "Bicycle",
          "Cycle",
        ],
        default: "Bike",
      },

      vehicleNumber: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      profileImage: {
        type: String,
        default: "",
      },

      // =====================================
      // ACTIVE STATUS
      // =====================================

      isAvailable: {
        type: Boolean,
        default: true,
      },

      // =====================================
      // ACTIVE ORDERS
      // =====================================

      currentOrders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      ],

      maxOrders: {
        type: Number,
        default: 10,
      },

      // =====================================
      // EARNINGS
      // =====================================

      walletBalance: {
        type: Number,
        default: 0,
      },

      totalEarnings: {
        type: Number,
        default: 0,
      },

      withdrawnAmount: {
        type: Number,
        default: 0,
      },

      // =====================================
      // ORDER STATS
      // =====================================

      totalAcceptedOrders: {
        type: Number,
        default: 0,
      },

      totalRejectedOrders: {
        type: Number,
        default: 0,
      },

      // =====================================
      // ACCOUNT STATUS
      // =====================================

      isVerified: {
        type: Boolean,
        default: true,
      },

      role: {
        type: String,
        default: "deliveryPartner",
      },
      vendor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vendor",
  default: null,
}
    },
    {
      timestamps: true,
    }
  );

const DeliveryPartner =
  mongoose.models.DeliveryPartner ||
  mongoose.model(
    "DeliveryPartner",
    deliveryPartnerSchema
  );

export default DeliveryPartner;