import mongoose from "mongoose";

import Order from "../models/Order.model.js";
import Product from "../models/product.model.js";
import DeliveryPartner from "../models/DeliveryPartner.model.js";
import notificationModel from "../models/notification.model.js";

import {
  reduceOrderStock,
  validateOrderStock,
} from "../utils/stock.js";

// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = async (req, res) => {
  try {

    const {
      userId,
      products,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !userId ||
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    // =========================
    // FORMAT ITEMS
    // =========================

    const formattedItems =
      products.map((item) => ({
        product: item.productId,
        variant: item.variantId || null,

        variantSize:
          item.variantSize || "Default",

        name: item.name,
        image: item.image,

        quantity: item.quantity,
        price: item.price,
      }));

    // =========================
    // CREATE ORDER
    // =========================

    const order = await Order.create({
      user: userId,

      items: formattedItems,

      // IMPORTANT
      shippingAddress: {
        firstName:
          shippingAddress.firstName,

        lastName:
          shippingAddress.lastName,

        email:
          shippingAddress.email,

        phone:
          shippingAddress.phone,

        street:
          shippingAddress.street,

        city:
          shippingAddress.city,

        state:
          shippingAddress.state,

        zipcode:
          shippingAddress.zipcode,

        country:
          shippingAddress.country,
      },

      totalAmount,

      paymentMethod,

      paymentStatus,

      orderStatus: "Order Placed",

      deliveryStatus: "Pending",
    });

    res.status(201).json({
      success: true,
      order,
    });

  } catch (error) {

    console.log(
      "CREATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET USER ORDERS
// ======================================================
export const getMyOrders = async (req, res) => {
  try {

    const { userId } = req.params;

    const orders = await Order.find({
      user: userId,
    })
      .populate(
        "deliveryPartner",
        "name phone vehicleType"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    console.log(
      "GET MY ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL ORDERS
// ======================================================
export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .populate(
        "deliveryPartner",
        "name phone vehicleType"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    console.log(
      "GET ALL ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE ORDER
// ======================================================
export const getSingleOrder = async (req, res) => {
  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await Order.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email"
      )
      .populate(
        "deliveryPartner",
        "name phone vehicleType"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    console.log(
      "GET SINGLE ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET VENDOR ORDERS
// ======================================================
export const getVendorOrders = async (req, res) => {
  try {

    const vendorId = req.vendor._id;

    // ======================================================
    // FIND VENDOR PRODUCTS
    // ======================================================

    const vendorProducts =
      await Product.find({
        vendor: vendorId,
      }).select("_id");

    const productIds =
      vendorProducts.map(
        (product) => product._id
      );

    // ======================================================
    // FIND ORDERS
    // ======================================================

    const orders = await Order.find({
      "items.product": {
        $in: productIds,
      },
    })
      .populate(
        "user",
        "name email"
      )
      .populate(
        "deliveryPartner",
        "name phone vehicleType profileImage"
      )
      .sort({ createdAt: -1 });

    // ======================================================
    // FILTER ONLY VENDOR ITEMS
    // ======================================================

    const filteredOrders =
      orders.map((order) => {

        const vendorItems =
          order.items.filter(
            (item) =>
              item.product &&
              productIds.some(
                (id) =>
                  id.toString() ===
                  item.product.toString()
              )
          );

        return {
          ...order._doc,
          items: vendorItems,
        };
      });

    res.status(200).json({
      success: true,
      orders: filteredOrders,
    });

  } catch (error) {

    console.log(
      "GET VENDOR ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE ORDER STATUS (VENDOR)
// ======================================================
export const updateOrderStatus = async (req, res) => {
  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus =
      req.body.orderStatus;

    await order.save();

    // ======================================================
    // NOTIFICATION
    // ======================================================

    await notificationModel.create({
      user: order.user,

      title:
        "Order Status Updated",

      message:
        `Your order #${order._id
          .toString()
          .slice(-6)} status changed to "${req.body.orderStatus}"`,
    });

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });

  } catch (error) {

    console.log(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ASSIGN DELIVERY PARTNER
// ======================================================
export const assignDeliveryPartner =
  async (req, res) => {

    try {

      const {
        orderId,
        deliveryPartnerId,
      } = req.body;

      if (
        !orderId ||
        !deliveryPartnerId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order ID and Delivery Partner ID are required",
        });
      }

      // =========================
      // FIND ORDER
      // =========================

      const order =
        await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Prevent duplicate assignment
      if (order.deliveryPartner) {
        return res.status(400).json({
          success: false,
          message:
            "Order already assigned",
        });
      }

      // =========================
      // FIND PARTNER
      // =========================

      const partner =
        await DeliveryPartner.findById(
          deliveryPartnerId
        );

      if (!partner) {
        return res.status(404).json({
          success: false,
          message:
            "Delivery Partner not found",
        });
      }

      // =========================
      // CHECK ACTIVE ORDERS
      // =========================

      const activeOrdersCount =
        partner.currentOrders?.length || 0;

      if (activeOrdersCount >= 10) {

        partner.isAvailable = false;

        await partner.save();

        return res.status(400).json({
          success: false,
          message:
            "Delivery Partner already has 10 active orders",
        });
      }

      // =========================
      // ASSIGN ORDER
      // =========================

      order.deliveryPartner =
        partner._id;

      order.deliveryStatus =
        "Assigned";

      order.orderStatus =
        "Processing";

      // 10% earning
      order.partnerEarning =
        Math.round(
          order.totalAmount * 0.1
        );

      await order.save();

      // =========================
      // UPDATE PARTNER
      // =========================

      partner.currentOrders.push(
        order._id
      );

      // Max 10 orders
      if (
        partner.currentOrders.length >= 10
      ) {
        partner.isAvailable = false;
      }

      await partner.save();

      // =========================
      // NOTIFICATION
      // =========================

      await notificationModel.create({
        user: order.user,

        title:
          "Delivery Partner Assigned",

        message:
          `${partner.name} has been assigned to your order.`,
      });

      res.status(200).json({
        success: true,
        message:
          "Delivery Partner assigned successfully",
        order,
      });

    } catch (error) {

      console.log(
        "ASSIGN DELIVERY PARTNER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };