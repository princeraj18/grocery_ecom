import Order from "../models/Order.model.js";
import mongoose from "mongoose";

// ====================================
// CREATE ORDER
// ====================================
const createOrder = async (req, res) => {
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

    // accept either `products` or `cartItems` from the client
    const productsSource = products || cartItems || [];
    const orderTotal = Number(totalAmount ?? total ?? 0);

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!productsSource || productsSource.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required",
      });
    }

    // Format Products -> items for Order schema
    const formattedProducts = productsSource.map((item) => {
      const rawProd = item.productId || item._id;
      const isObjectId = rawProd && mongoose.Types.ObjectId.isValid(rawProd);

      const out = {
        name: item.name,
        image: Array.isArray(item.image) ? item.image[0] : item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
      };

      if (isObjectId) out.product = rawProd;
      else if (rawProd) out.clientId = rawProd;

      return out;
    });


    // Create Order (store under `items` as per Order model)
    const order = await Order.create({
      user: userId,

      items: formattedProducts,

      shippingAddress,

      totalAmount: orderTotal,

      paymentMethod: paymentMethod || "COD",

      paymentStatus: paymentStatus || "Pending",

      orderStatus: "Order Placed",
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================================
// GET MY ORDERS
// ====================================
const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("GET MY ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================================
// GET ALL ORDERS
// ====================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("GET ALL ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================================
// GET SINGLE ORDER
// ====================================
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

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
    console.log("GET SINGLE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
};