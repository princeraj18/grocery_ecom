import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import WithdrawRequest from "../models/WithdrawRequest.model.js";
import DeliveryPartner from "../models/DeliveryPartner.model.js";
import Order from "../models/Order.model.js";
import Setting from "../models/Setting.model.js"; // Import the model at the top

// =======================================
// REGISTER ADMIN
// =======================================
export const registerAdmin = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // check existing admin
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// LOGIN ADMIN
// =======================================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // create access token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // create refresh token (longer lived) and persist it
    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    admin.refreshToken = refreshToken;
    await admin.save();

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// GET ADMIN PROFILE
// =======================================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================================
// REFRESH TOKEN
// =======================================
export const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      if (error && error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Refresh token expired" });
      }
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =======================================
// LOGOUT ADMIN
// =======================================
export const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token required" });
    }

    const admin = await Admin.findOne({ refreshToken });
    if (!admin) {
      return res.status(200).json({ success: true, message: "Logged out" });
    }

    admin.refreshToken = undefined;
    await admin.save();

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// =======================================
// FORGOT PASSWORD (ADMIN)
// =======================================
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin with this email does not exist." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and 1-hour expiration time to the DB
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = Date.now() + 3600000; 
    await admin.save();

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Reset link pointing to the dedicated admin frontend URL layout
  // Change this line inside forgotAdminPassword:
const resetUrl = `${process.env.ADMIN_FRONTEND_URL}/admin/reset-password/${resetToken}`;
    const mailOptions = {
      to: admin.email,
      from: process.env.EMAIL_USER,
      subject: "Admin Portal Password Reset Requests",
      html: `
        <h3>Admin Portal Security Recovery</h3>
        <p>A password reset was requested for your administrator profile.</p>
        <p>Click the link below to change your security credentials securely. This link is valid for 1 hour:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>If you did not make this request, please change your security protocols immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Admin recovery link sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// =======================================
// RESET PASSWORD (ADMIN)
// =======================================
export const resetAdminPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Token is invalid or has expired." });
    }

    // Hash the new security string
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Clear temporary reset tokens
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// =======================================
// ADMIN DELIVERY DASHBOARD
// =======================================
// =======================================
// UPDATED ADMIN DELIVERY DASHBOARD
// =======================================
// =======================================================================
// UPDATED ADMIN DELIVERY DASHBOARD (WITH FULL COMPREHENSIVE ANALYTICS)
// =======================================================================
export const getDeliveryDashboard = async (req, res) => {
  try {
    // Current timestamp variables for historical aggregation parsing (2026)
    const baseDate = new Date();
    const sixMonthsAgo = new Date(baseDate.getFullYear(), baseDate.getMonth() - 5, 1);

    const [
      totalPartners,
      availablePartners,
      totals,
      totalOrders,
      activeDeliveries,
      completedDeliveries,
      assignedOrders,
      pendingOrders,
      topPartners,
      recentWithdrawRequests,
      
      // REAL DATA SETS COMPILED GLOBALLY FOR YOUR 7 GRAPHS
      monthlyRevenueTrend,
      orderStatusDistribution,
      paymentMethodShare,
      vehicleTypeDistribution,
      orderValueBands,
      engagementScatterPoints,
      hourlyTrafficLoad
    ] = await Promise.all([
      DeliveryPartner.countDocuments(),
      DeliveryPartner.countDocuments({ isAvailable: true }),
      DeliveryPartner.aggregate([
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$totalEarnings" },
            walletBalance: { $sum: "$walletBalance" },
            withdrawnAmount: { $sum: "$withdrawnAmount" },
          },
        },
      ]),
      Order.countDocuments({ deliveryPartner: { $ne: null } }),
      Order.countDocuments({
        deliveryStatus: { $in: ["Assigned", "Accepted", "Picked", "Out for Delivery"] },
      }),
      Order.countDocuments({ deliveryStatus: "Delivered" }),
      Order.countDocuments({ deliveryStatus: "Assigned" }),
      Order.countDocuments({ deliveryStatus: "Pending" }),
      DeliveryPartner.find()
        .select("name phone vehicleType isAvailable totalEarnings walletBalance withdrawnAmount totalAcceptedOrders totalRejectedOrders")
        .sort({ totalEarnings: -1 })
        .limit(5)
        .lean(),
      WithdrawRequest.find()
        .populate("partner", "name email phone walletBalance")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // 1. LINE & AREA GRAPH DATA: Monthly Progress Metrics (Trailing 6 Months)
      Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
            payouts: { $sum: { $ifNull: ["$partnerEarning", 0] } }
          }
        },
        { $sort: { "_id": 1 } }
      ]),

      // 2. BAR GRAPH DATA: Order Processing Distribution Pipeline
      Order.aggregate([
        {
          $group: {
            _id: "$deliveryStatus",
            count: { $sum: 1 }
          }
        }
      ]),

      // 3. PIE CHART DATA: Payment Gateway Performance Matrix 
      Order.aggregate([
        {
          $group: {
            _id: { $ifNull: ["$paymentMethod", "Digital Wallet"] },
            value: { $sum: "$totalAmount" },
            count: { $sum: 1 }
          }
        }
      ]),

      // 4. DONUT / PIE CHART DATA: Active Fleet Profiles
      DeliveryPartner.aggregate([
        {
          $group: {
            _id: { $ifNull: ["$vehicleType", "Bicycle"] },
            count: { $sum: 1 }
          }
        }
      ]),

      // 5. HISTOGRAM DATA: Order Financial Bracket Frequency Distribution
      Order.aggregate([
        {
          $bucket: {
            groupBy: "$totalAmount",
            boundaries: [0, 300, 1000, 2500, 100000],
            default: "Enterprise Bulk",
            output: { count: { $sum: 1 } }
          }
        }
      ]),

      // 6. SCATTER PLOT DATA: Driver Order Volume vs Lifetime Financial Payout Performance
      DeliveryPartner.aggregate([
        {
          $project: {
            x: { $ifNull: ["$totalAcceptedOrders", 0] }, 
            y: { $ifNull: ["$totalEarnings", 0] },
            z: { $add: [{ $ifNull: ["$totalAcceptedOrders", 0] }, { $ifNull: ["$totalRejectedOrders", 0] }] }
          }
        },
        { $sort: { y: -1 } },
        { $limit: 30 } // Keep the scatter plot clean and performant
      ]),

      // 7. DOT PLOT DATA: Hourly Order Load Concentration Analysis
      Order.aggregate([
        {
          $project: {
            hour: { $hour: { date: "$createdAt", timezone: "+05:30" } } // Localized Indian Standard Time Offset
          }
        },
        {
          $group: {
            _id: "$hour",
            weight: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    const summary = totals[0] || { totalEarnings: 0, walletBalance: 0, withdrawnAmount: 0 };

    // Format human-readable Hour Strings for Dot Plot
    const formattedDotPlot = hourlyTrafficLoad.map(item => {
      const h = item._id;
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      return {
        hour: `${displayHour.toString().padStart(2, '0')}:00 ${period}`,
        weight: item.weight
      };
    });

    // Formatting Histogram Bucket Output Strings
    const formattedHistogram = orderValueBands.map(bucket => {
      let label = "₹2500+";
      if (bucket._id === 0) label = "₹0-300";
      if (bucket._id === 300) label = "₹301-1000";
      if (bucket._id === 1000) label = "₹1001-2500";
      return { range: label, frequency: bucket.count };
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalPartners,
        availablePartners,
        busyPartners: totalPartners - availablePartners,
        totalEarnings: summary.totalEarnings || 0,
        walletBalance: summary.walletBalance || 0,
        withdrawnAmount: summary.withdrawnAmount || 0,
        activeDeliveries,
        completedDeliveries,
        totalOrders,
        assignedOrders,
        pendingOrders,
        topPartners,
        recentWithdrawRequests,
        
        // CONSOLIDATED GRAPH PAYLOAD READY FOR RECHARTS
        graphs: {
          monthlyTrends: monthlyRevenueTrend.map(item => ({
            month: item._id,
            revenue: item.revenue,
            orders: item.orderCount,
            payouts: item.payouts
          })),
          orderDistribution: orderStatusDistribution.map(item => ({
            status: item._id || "Unassigned",
            count: item.count
          })),
          paymentShare: paymentMethodShare.map(item => ({
            name: item._id,
            value: item.value,
            orders: item.count
          })),
          fleetDistribution: vehicleTypeDistribution.map(item => ({
            vehicle: item._id,
            count: item.count
          })),
          valueHistogram: formattedHistogram,
          driverScatter: engagementScatterPoints,
          hourlyLoadDotPlot: formattedDotPlot
        }
      },
    });

  } catch (error) {
    console.error("ADMIN LEDGER ANALYTICS CRASH:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// =======================================
// GET GLOBAL SYSTEM SETTINGS
// =======================================
export const getSystemSettings = async (req, res) => {
  try {
    // Look for existing document or create an initial fallback document if empty
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load system configs" });
  }
};

// =======================================
// UPDATE GLOBAL SYSTEM SETTINGS
// =======================================
export const updateSystemSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    // Map properties explicitly onto the found document object instance
    Object.assign(settings, req.body);
    await settings.save();

    res.status(200).json({ success: true, message: "Settings updated", settings });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to save system configs" });
  }
};
// =======================================
// ADMIN DELIVERY EARNINGS
// =======================================
export const getDeliveryEarnings =
  async (req, res) => {

    try {

      const [
        partners,
        deliveredOrders,
        withdrawRequests,
      ] = await Promise.all([
        DeliveryPartner.find()
          .select(
            "name email phone vehicleType totalEarnings walletBalance withdrawnAmount"
          )
          .sort({ totalEarnings: -1 })
          .lean(),
        Order.find({
          deliveryStatus: "Delivered",
          deliveryPartner: {
            $ne: null,
          },
        })
          .populate(
            "deliveryPartner",
            "name email phone"
          )
          .sort({ deliveredAt: -1 })
          .limit(100)
          .lean(),
        WithdrawRequest.find()
          .populate(
            "partner",
            "name email phone walletBalance"
          )
          .sort({ createdAt: -1 })
          .lean(),
      ]);

      const summary =
        partners.reduce(
          (acc, partner) => {
            acc.totalEarnings +=
              partner.totalEarnings || 0;
            acc.walletBalance +=
              partner.walletBalance || 0;
            acc.withdrawnAmount +=
              partner.withdrawnAmount || 0;
            return acc;
          },
          {
            totalEarnings: 0,
            walletBalance: 0,
            withdrawnAmount: 0,
          }
        );

      summary.pendingWithdrawAmount =
        withdrawRequests
          .filter(
            (request) =>
              request.status === "Pending"
          )
          .reduce(
            (total, request) =>
              total + (request.amount || 0),
            0
          );

      res.status(200).json({
        success: true,
        earnings: {
          summary,
          partners,
          deliveredOrders,
          withdrawRequests,
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



export const getDeliveryPartnerDetails = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id)
      .select("-password")
      .lean();

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    const totalResponses =
      (partner.totalAcceptedOrders || 0) +
      (partner.totalRejectedOrders || 0);

    const acceptanceRate =
      totalResponses === 0
        ? 0
        : Math.round(
            (partner.totalAcceptedOrders / totalResponses) * 100
          );

    res.status(200).json({
      success: true,
      partner: {
        ...partner,

        walletBalance:
          partner.walletBalance || 0,

        totalEarnings:
          partner.totalEarnings || 0,

        withdrawnAmount:
          partner.withdrawnAmount || 0,

        totalAcceptedOrders:
          partner.totalAcceptedOrders || 0,

        totalRejectedOrders:
          partner.totalRejectedOrders || 0,

        acceptanceRate,
      },
    });
  } catch (error) {
    console.log(
      "GET DELIVERY PARTNER DETAILS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};