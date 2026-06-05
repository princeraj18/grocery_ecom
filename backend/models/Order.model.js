import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // =====================================
    // USER
    // =====================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================
    // ORDER ITEMS
    // =====================================

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          default: null,
        },

        variantSize: {
          type: String,
          default: "Default",
        },

        clientId: String,

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          default: "",
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // =====================================
    // SHIPPING ADDRESS
    // =====================================

    shippingAddress: {
      firstName: String,

      lastName: String,

      email: String,

      street: String,

      city: String,

      state: String,

      zipcode: Number,

      country: String,

      phone: String,
    },

    // =====================================
    // PAYMENT
    // =====================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],
      default: "Pending",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    // =====================================
    // ORDER STATUS
    // =====================================

    orderStatus: {
      type: String,
      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Placed",
    },

    // =====================================
    // STOCK
    // =====================================

    stockReduced: {
      type: Boolean,
      default: false,
    },

    // =====================================
    // VENDOR
    // =====================================

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    // =====================================
    // DELIVERY PARTNER
    // =====================================

    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null,
    },

    deliveryStatus: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Accepted",
        "Picked",
        "Out for Delivery",
        "Delivered",
        "Rejected",
      ],
      default: "Pending",
    },

    // =====================================
    // DELIVERY EARNING
    // =====================================

    partnerEarning: {
      type: Number,
      default: 0,
    },

    earningTransferred: {
      type: Boolean,
      default: false,
    },

    // =====================================
    // DELIVERY DATES
    // =====================================

    acceptedAt: Date,

    pickedAt: Date,

    deliveredAt: Date,

    rejectedAt: Date,

    estimatedDeliveryTime: String,

    deliveryNotes: String,
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order ||
  mongoose.model(
    "Order",
    orderSchema
  );

export default Order;