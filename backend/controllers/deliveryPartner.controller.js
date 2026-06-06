import DeliveryPartner from "../models/DeliveryPartner.model.js";
import Order from "../models/Order.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

  import WithdrawRequest from "../models/WithdrawRequest.model.js";


// ======================================
// REGISTER DELIVERY PARTNER (FIXED)
// ======================================

export const registerDeliveryPartner = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      phone,
      vehicleNumber,
      vehicleType,
      vendor,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !name ||
      !email ||
      !password ||
      !phone
    ) {

      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // =========================
    // CHECK EXISTING
    // =========================

    const existingPartner =
      await DeliveryPartner.findOne({
        email,
      });

    if (existingPartner) {

      return res.status(400).json({
        success: false,
        message: "Delivery Partner already exists",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =========================
    // CREATE PARTNER
    // =========================

    const partner =
      await DeliveryPartner.create({

        name,

        email,

        password: hashedPassword,

        phone,

        vehicleType:
          vehicleType || "Bike",

        vehicleNumber:
          vehicleNumber || "",

        // IMPORTANT FIX
        vendor:
          vendor || null,
      });

    // =========================
    // TOKEN
    // =========================

    const token = jwt.sign(
      {
        id: partner._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =========================
    // REMOVE PASSWORD
    // =========================

    const partnerData =
      partner.toObject();

    delete partnerData.password;

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({

      success: true,

      token,

      partner: partnerData,
    });

  } catch (error) {

    console.log(
      "REGISTER DELIVERY PARTNER ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};



// ======================================
// LOGIN DELIVERY PARTNER
// ======================================
export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const partner = await DeliveryPartner.findOne({ email });
    if (!partner) {
      return res.status(404).json({ success: false, message: "Partner not found" });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const partnerData = partner.toObject();
    delete partnerData.password;

    res.status(200).json({
      success: true,
      token,
      partner: partnerData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// GET PROFILE
// ======================================
export const getProfile = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.deliveryPartner._id).select("-password");
    res.status(200).json({ success: true, partner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// GET MY ORDERS
// ======================================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.deliveryPartner._id });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ====================================================================
// GET DELIVERY PARTNERS (Filtered by Vendor context if authenticated)
// ====================================================================
// ====================================================================
export const getDeliveryPartners = async (req, res) => {
  try {
    const { availableOnly } = req.query;
    
    // Build a dynamic filter object
    let filter = {};
    
    // If frontend sends ?availableOnly=true, strictly filter. Otherwise, fetch all.
    if (availableOnly === "true") {
      filter.isAvailable = true;
    }

    // Optional: If you want vendors to only see partners matching their setup,
    // you can uncomment the line below:
    // if (req.vendor?._id) filter.vendor = req.vendor._id;

    const partners = await DeliveryPartner.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: partners.length,
      partners,
    });

  } catch (error) {
    console.log("GET DELIVERY PARTNERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET SINGLE DELIVERY PARTNER
// ======================================
export const getSingleDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id)
      .select(
        "-password name email phone address profileImage isAvailable isVerified role vehicleType vehicleNumber walletBalance totalEarnings withdrawnAmount totalAcceptedOrders totalRejectedOrders"
      );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    res.status(200).json({
      success: true,
      partner: {
        ...partner.toObject(),
        totalEarnings: partner.totalEarnings || 0,
      },
    });
  } catch (error) {
    console.log("GET SINGLE DELIVERY PARTNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getDashboardData = async (req, res) => {
  try {
    const partnerId = req.deliveryPartner._id;

    const partner = await DeliveryPartner.findById(partnerId);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    // Active Order
    const activeOrder = await Order.findOne({
      deliveryPartner: partnerId,
      deliveryStatus: {
        $in: [
          "Assigned",
          "Accepted",
          "Picked",
          "Out for Delivery",
        ],
      },
    });

    // Completed Trips
    const completedTrips = await Order.countDocuments({
      deliveryPartner: partnerId,
      deliveryStatus: "Delivered",
    });

    // Today's Earnings
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayOrders = await Order.find({
      deliveryPartner: partnerId,
      deliveryStatus: "Delivered",
      deliveredAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const todayEarnings = todayOrders.reduce(
      (sum, order) => sum + Number(order.partnerEarning || 0),
      0
    );

    // Total Earnings from Orders
    const deliveredOrders = await Order.find({
      deliveryPartner: partnerId,
      deliveryStatus: "Delivered",
    });

    const totalEarnings = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.partnerEarning || 0),
      0
    );

    // Acceptance Rate
    const totalResponses =
      (partner.totalAcceptedOrders || 0) +
      (partner.totalRejectedOrders || 0);

    const acceptanceRate =
      totalResponses === 0
        ? 0
        : Math.round(
            ((partner.totalAcceptedOrders || 0) /
              totalResponses) *
              100
          );

    const formattedActiveOrder = activeOrder
      ? {
          _id: activeOrder._id,
          orderStatus: activeOrder.deliveryStatus,
          pickupAddress:
            activeOrder.vendor
              ? "Vendor Pickup"
              : "Store Pickup",
          deliveryAddress: `
            ${activeOrder.shippingAddress?.street || ""},
            ${activeOrder.shippingAddress?.city || ""},
            ${activeOrder.shippingAddress?.state || ""}
          `,
        }
      : null;

    return res.status(200).json({
      success: true,
      partnerName: partner.name,

      stats: {
        todayEarnings,
        totalEarnings,
        walletBalance: partner.walletBalance || 0,
        withdrawnAmount: partner.withdrawnAmount || 0,
        completedTrips,
        acceptanceRate,
      },

      activeOrder: formattedActiveOrder,
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const respondToOrder =
  async (req, res) => {

    try {

      const { orderId, action } =
        req.body;

      const order =
        await Order.findById(orderId);

      const partner =
        await DeliveryPartner.findById(
          req.deliveryPartner._id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (
        !order.deliveryPartner ||
        order.deliveryPartner.toString() !==
          req.deliveryPartner._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // =========================
      // ACCEPT
      // =========================

      if (action === "accept") {

        order.deliveryStatus =
          "Accepted";

        order.acceptedAt =
          new Date();

        order.orderStatus =
          "Processing";

        partner.totalAcceptedOrders += 1;
      }

      // =========================
      // REJECT
      // =========================

      else if (
        action === "reject"
      ) {

        order.deliveryStatus =
          "Pending";

        order.deliveryPartner =
          null;

        order.orderStatus =
          "Processing";

        order.rejectedAt =
          new Date();

        partner.totalRejectedOrders += 1;

        // Remove order
        partner.currentOrders =
          partner.currentOrders.filter(
            (id) =>
              id.toString() !==
              order._id.toString()
          );

        // Available again
        if (
          partner.currentOrders.length < 10
        ) {
          partner.isAvailable = true;
        }
      }

      else {
        return res.status(400).json({
          success: false,
          message: "Invalid action",
        });
      }

      await order.save();
      await partner.save();

      res.json({
        success: true,
        message:
          `Order ${action}ed successfully`,
      });

    } catch (error) {

      console.log(
        "RESPOND TO ORDER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// =======================================
// UPDATE DELIVERY STATUS
// =======================================

export const updateDeliveryStatus =
  async (req, res) => {

    try {

      const {
        orderId,
        deliveryStatus,
      } = req.body;

      const order =
        await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // ===================================
      // UPDATE STATUS
      // ===================================

      order.deliveryStatus =
        deliveryStatus;

      // ===================================
      // DELIVERED
      // ===================================

      if (
        deliveryStatus === "Delivered"
      ) {

        order.orderStatus = "Delivered";
        order.deliveredAt = new Date();
        order.paymentStatus = "Paid";
        order.isPaid = true;

        const partner =
          await DeliveryPartner.findById(
            order.deliveryPartner
          );

        if (partner) {

          // =================================
          // REMOVE ORDER FROM ACTIVE ORDERS
          // =================================

          partner.currentOrders =
            partner.currentOrders.filter(
              (id) =>
                id.toString() !==
                order._id.toString()
            );

          // =================================
          // ADD EARNING
          // =================================

          partner.walletBalance +=
            order.partnerEarning || 0;

          partner.totalEarnings +=
            order.partnerEarning || 0;

          // =================================
          // AVAILABLE AGAIN
          // =================================

          if (
            partner.currentOrders
              .length < 10
          ) {
            partner.isAvailable = true;
          }

          await partner.save();
        }
      }

      await order.save();

      res.status(200).json({
        success: true,
        message:
          "Delivery status updated",
        order,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


export const getEarningsHistory =
async (req, res) => {

  try {

    const [
      partner,
      orders,
      withdrawRequests,
    ] = await Promise.all([
      DeliveryPartner.findById(
        req.deliveryPartner._id
      ).select(
        "walletBalance totalEarnings withdrawnAmount"
      ),
      Order.find({
        deliveryPartner:
          req.deliveryPartner._id,

        deliveryStatus: "Delivered",
      })
      .sort({ deliveredAt: -1 }),
      WithdrawRequest.find({
        partner:
          req.deliveryPartner._id,
      }).sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      earnings: orders,
      walletBalance:
        partner?.walletBalance || 0,
      totalEarnings:
        partner?.totalEarnings || 0,
      withdrawnAmount:
        partner?.withdrawnAmount || 0,
      withdrawRequests,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {

  try {

    const partner =
      await DeliveryPartner.findById(
        req.deliveryPartner._id
      );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    const {
      name,
      phone,
      vehicleType,
      vehicleNumber,
      address,
    } = req.body;

    if (name) {
      partner.name = name;
    }

    if (phone) {
      partner.phone = phone;
    }

    if (vehicleType) {
      partner.vehicleType =
        vehicleType;
    }

    if (vehicleNumber) {
      partner.vehicleNumber =
        vehicleNumber;
    }

    if (address) {
      partner.address = address;
    }

    // Profile Image
    if (req.file) {

      partner.profileImage =
        `http://localhost:5000/uploads/${req.file.filename}`;
    }

    await partner.save();

    res.json({
      success: true,
      message:
        "Profile updated successfully",
      partner,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestWithdraw =
  async (req, res) => {

    try {

     const partnerId = req.deliveryPartner._id;
      const { amount } =
        req.body;

      const partner =
        await DeliveryPartner.findById(
          partnerId
        );

      if (
        amount > partner.walletBalance
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Insufficient balance",
        });
      }

      const request =
        await WithdrawRequest.create({

          partner: partnerId,
          amount,

        });

      res.json({
        success: true,
        request,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ==========================================
// MARK ORDER DELIVERED
// ==========================================
export const markOrderDelivered =
  async (req, res) => {

    try {

      const { orderId } = req.body;

      const partner =
  await DeliveryPartner.findById(
    req.deliveryPartner._id
  );

      const order =
        await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // ====================================
      // UPDATE ORDER
      // ====================================

      order.deliveryStatus =
        "Delivered";

      order.orderStatus =
        "Delivered";

      order.paymentStatus =
        "Paid";

      order.deliveredAt =
        new Date();

      await order.save();

      // ====================================
      // REMOVE ACTIVE ORDER
      // ====================================

      partner.currentOrders =
        partner.currentOrders.filter(
          (id) =>
            id.toString() !==
            orderId.toString()
        );

      // ====================================
      // AVAILABLE AGAIN
      // ====================================

      if (
        partner.currentOrders.length < 10
      ) {
        partner.isAvailable = true;
      }

      // ====================================
      // UPDATE EARNINGS
      // ====================================

      partner.totalEarnings +=
        order.partnerEarning || 0;

      partner.walletBalance +=
        order.partnerEarning || 0;

      await partner.save();

      res.status(200).json({
        success: true,
        message:
          "Order delivered successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// =======================================
// CREATE WITHDRAW REQUEST
// =======================================
export const createWithdrawRequest = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const partner = await DeliveryPartner.findById(
      req.deliveryPartner._id
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    if (amount > partner.walletBalance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const withdrawRequest =
      await WithdrawRequest.create({
        partner: req.deliveryPartner._id,
        amount,
      });

    res.status(201).json({
      success: true,
      message: "Withdraw request submitted",
      withdrawRequest,
    });

  } catch (error) {
    console.log("CREATE WITHDRAW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
