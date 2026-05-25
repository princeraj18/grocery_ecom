import User from "../models/User.model.js";

import Vendor from "../models/Vendor.model.js";

import Product from "../models/Product.model.js";

import Order from "../models/Order.model.js";

// ======================================
// GET DASHBOARD ANALYTICS
// ======================================
export const getAnalytics =
  async (req, res) => {

    try {

      // TOTAL USERS
      const totalUsers =
        await User.countDocuments();

      // TOTAL VENDORS
      const totalVendors =
        await Vendor.countDocuments();

      // TOTAL PRODUCTS
      const totalProducts =
        await Product.countDocuments();

      // TOTAL ORDERS
      const totalOrders =
        await Order.countDocuments();

      // TOTAL REVENUE
      const revenueData =
        await Order.aggregate([
          {
            $match: {
              orderStatus:
                "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum:
                  "$totalAmount",
              },
            },
          },
        ]);

      const totalRevenue =
        revenueData.length > 0
          ? revenueData[0]
              .totalRevenue
          : 0;

      res.status(200).json({
        success: true,

        analytics: {
          totalUsers,

          totalVendors,

          totalProducts,

          totalOrders,

          totalRevenue,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// GET VENDOR ANALYTICS
// ======================================

  async (req, res) => {

    try {

      // ==============================
      // TOTAL PRODUCTS
      // ==============================
      const totalProducts =
        await Product.countDocuments();

      // ==============================
      // TOTAL ORDERS
      // ==============================
      const totalOrders =
        await Order.countDocuments();

      // ==============================
      // TOTAL CUSTOMERS
      // ==============================
      const totalCustomers =
        await User.countDocuments();

      // ==============================
      // TOTAL REVENUE
      // ==============================
      const orders =
        await Order.find({
          paymentStatus: "Paid",
        });

      const totalRevenue =
        orders.reduce(
          (total, order) =>
            total +
            (order.totalAmount || 0),
          0
        );

      // ==============================
      // MONTHLY REVENUE
      // ==============================
      const monthlyRevenue =
        await Order.aggregate([
          {
            $match: {
              paymentStatus: "Paid",
            },
          },

          {
            $group: {
              _id: {
                month: {
                  $month: "$createdAt",
                },
              },

              revenue: {
                $sum: "$totalAmount",
              },
            },
          },

          {
            $sort: {
              "_id.month": 1,
            },
          },
        ]);

      // ==============================
      // PAYMENT METHODS
      // ==============================
      const codOrders =
        await Order.countDocuments({
          paymentMethod: "COD",
        });

      const onlineOrders =
        await Order.countDocuments({
          paymentMethod: "Online",
        });

      // ==============================
      // RESPONSE
      // ==============================
      res.status(200).json({
        success: true,

        analytics: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers,

          paymentStats: {
            codOrders,
            onlineOrders,
          },

          monthlyRevenue,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };