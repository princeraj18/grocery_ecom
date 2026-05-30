import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import mongoose from "mongoose";
import {
  reduceOrderStock,
  validateOrderStock,
} from "../utils/stock.js";
// ====================================
// CREATE ORDER
// ====================================
const createOrder = async (
  req,
  res
) => {
  try {
    const {
      userId,
      products,
      cartItems,
      shippingAddress,
      totalAmount,
      total,
      paymentMethod,
      paymentStatus,
    } = req.body;

    const productsSource =
      products || cartItems || [];

    const orderTotal = Number(
      totalAmount ?? total ?? 0
    );

    if (!userId) {
      return res.status(400).json({
        success: false,
        message:
          "User ID is required",
      });
    }

    if (
      !productsSource ||
      productsSource.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Products are required",
      });
    }

    const formattedProducts = [];

    // =====================
    // CHECK STOCK
    // =====================

    for (const item of productsSource) {
      const productId =
        item.productId ||
        item._id;

      const quantity =
        Number(item.quantity);

      if (
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        continue;
      }

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      if (
        product.stockQuantity <
        quantity
      ) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stockQuantity} items left in stock`,
        });
      }

      formattedProducts.push({
        product:
          product._id,

        name:
          product.name,

        image:
          product.image?.[0] ||
          "",

        price:
          Number(item.price),

        quantity,

        variant:
          item.variantId ||
          item.variant ||
          undefined,

        variantSize:
          item.variantSize ||
          item.size,
      });
    }

    await validateOrderStock(
      formattedProducts
    );

    // =====================
    // CREATE ORDER
    // =====================

    const order =
      await Order.create({
        user: userId,

        items:
          formattedProducts,

        shippingAddress,

        totalAmount:
          orderTotal,

        paymentMethod:
          paymentMethod ||
          "COD",

        paymentStatus:
          paymentStatus ||
          "Pending",

        orderStatus:
          "Order Placed",
      });

    // =====================
    // REDUCE STOCK
    // =====================

    await reduceOrderStock(order);

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
      message:
        error.message,
    });
  }
};

// ====================================
// GET MY ORDERS
// ====================================
const getMyOrders = async (
  req,
  res
) => {
  try {

    const { userId } =
      req.params;

    const orders =
      await Order.find({
        user: userId,
      }).sort({
        createdAt: -1,
      });

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

// ====================================
// GET ALL ORDERS
// ====================================
const getAllOrders = async (
  req,
  res
) => {
  try {

    const orders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

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

// ====================================
// GET SINGLE ORDER
// ====================================
const getSingleOrder =
  async (req, res) => {

    try {

      // Validate ID
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order id",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "user",
          "name email"
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
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

// ====================================
// GET VENDOR ORDERS
// ONLY ORDERS OF LOGGED IN VENDOR
// ====================================
export const getVendorOrders =
  async (req, res) => {

    try {

      // ==========================
      // LOGGED IN VENDOR ID
      // ==========================
      const vendorId =
        req.vendor._id;

      // ==========================
      // FIND VENDOR PRODUCTS
      // ==========================
      const vendorProducts =
        await Product.find({
          vendor: vendorId,
        }).select("_id");

      // Product IDs array
     const productIds =
  vendorProducts.map(
    (product) => product._id
  );

      // ==========================
      // FIND ORDERS
      // ==========================
      const orders =
        await Order.find({
  "items.product": {
    $in: productIds,
  },
})
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      // ==========================
      // FILTER ONLY
      // VENDOR PRODUCTS
      // ==========================
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
        orders:
          filteredOrders,
      });

    } catch (error) {

      console.log(
        "GET VENDOR ORDERS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ====================================
// UPDATE ORDER STATUS
// ====================================
export const updateOrderStatus =
  async (req, res) => {

    try {

      // Validate ID
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order id",
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            orderStatus:
              req.body.orderStatus,
          },
          {
            new: true,
          }
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        order,
      });

    } catch (error) {

      console.log(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ====================================
// EXPORTS
// ====================================
export {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
};
