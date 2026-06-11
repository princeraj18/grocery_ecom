import Order from "../models/Order.model.js";
import Product from "../models/product.model.js";
import Payment from "../models/Payment.model.js";
import VendorAnalytics from "../models/vendorAnalytics.model.js";

// ========================================
// GET VENDOR ANALYTICS
// ========================================
export const getVendorAnalytics =
  async (req, res) => {
    try {

      const vendorId =
        req.vendor._id;

      // ========================================
      // GET VENDOR PRODUCTS
      // ========================================
      const products =
        await Product.find({
          vendor: vendorId,
        });

      const productIds =
        products.map(
          (product) =>
            product._id.toString()
        );

      // ========================================
      // GET ORDERS RELATED TO VENDOR PRODUCTS
      // ========================================
      const orders =
        await Order.find()
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      // FILTER ORDERS
      const vendorOrders =
        orders.filter((order) =>
          order.items.some((item) =>
            productIds.includes(
              item.product?.toString()
            )
          )
        );

      // ========================================
      // TOTAL ORDERS
      // ========================================
      const totalOrders =
        vendorOrders.length;

      // ========================================
      // TOTAL REVENUE
      // ========================================
      let totalRevenue = 0;

      vendorOrders.forEach(
        (order) => {
          totalRevenue +=
            order.totalAmount || 0;
        }
      );

      // ========================================
      // UNIQUE CUSTOMERS
      // ========================================
      const uniqueCustomers =
        new Set(
          vendorOrders.map(
            (order) =>
              order.user?._id?.toString()
          )
        );

      const totalCustomers =
        uniqueCustomers.size;

      // ========================================
      // TOTAL PRODUCTS
      // ========================================
      const totalProducts =
        products.length;

      // ========================================
      // ORDER STATUS COUNTS
      // ========================================
      const deliveredOrders =
        vendorOrders.filter(
          (order) =>
            order.orderStatus ===
            "Delivered"
        ).length;

      const pendingOrders =
        vendorOrders.filter(
          (order) =>
            order.orderStatus !==
              "Delivered" &&
            order.orderStatus !==
              "Cancelled"
        ).length;

      const cancelledOrders =
        vendorOrders.filter(
          (order) =>
            order.orderStatus ===
            "Cancelled"
        ).length;

      // ========================================
      // SAVE / UPDATE ANALYTICS
      // ========================================
      const analytics =
        await VendorAnalytics.findOneAndUpdate(
          {
            vendor: vendorId,
          },
          {
            vendor: vendorId,

            totalRevenue,

            totalOrders,

            totalProducts,

            totalCustomers,

            deliveredOrders,

            pendingOrders,

            cancelledOrders,
          },
          {
            new: true,
            upsert: true,
          }
        );

      // ========================================
      // RESPONSE
      // ========================================
      res.status(200).json({
        success: true,

        analytics,

        orders: vendorOrders,

        products,
      });

    } catch (error) {

      console.log(
        "VENDOR ANALYTICS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };