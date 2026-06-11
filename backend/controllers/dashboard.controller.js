import Product from "../models/product.model.js";
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Review from "../models/review.model.js";

export const getDashboardStats =
  async (req, res) => {

    try {

      // TOTAL PRODUCTS
      const totalProducts =
        await Product.countDocuments({
          vendor: req.vendor._id,
        });

      // TOTAL ORDERS
      const totalOrders =
        await Order.countDocuments();

      // TOTAL CUSTOMERS
      const totalCustomers =
        await User.countDocuments();

      // TOTAL REVIEWS
      const totalReviews =
        await Review.countDocuments();

      // TOTAL SALES
      const orders =
        await Order.find({
          paymentStatus: "Paid",
        });

      let totalSales = 0;

      orders.forEach((order) => {
        totalSales += order.totalAmount;
      });

      res.status(200).json({
        success: true,

        stats: {
          totalSales,
          totalOrders,
          totalProducts,
          totalCustomers,
          totalReviews,
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