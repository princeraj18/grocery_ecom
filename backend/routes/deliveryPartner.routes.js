import express from "express";
import {
  registerDeliveryPartner,
  loginDeliveryPartner,
  getDeliveryPartners,
  getMyOrders,
  getDashboardData,
  respondToOrder,
  updateDeliveryStatus,
  getEarningsHistory,
  updateProfile,
  getProfile,
  getSingleDeliveryPartner,
  createWithdrawRequest,
  getExtendedAnalytics // Imported for data analytics charts
} from "../controllers/deliveryPartner.controller.js";

import { protectDeliveryPartner } from "../middleware/deliveryPartner.middleware.js";
import vendorAuth from "../middleware/vendorAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// =======================================
// AUTH ROUTES
// =======================================
router.post("/register", registerDeliveryPartner);
router.post("/login", loginDeliveryPartner);

// =======================================
// VENDOR ROUTES
// =======================================
router.get("/all", getDeliveryPartners);

// =======================================
// DELIVERY PARTNER DATA & ANALYTICS
// =======================================
router.get("/dashboard", protectDeliveryPartner, getDashboardData);
router.get("/analytics/extended", protectDeliveryPartner, getExtendedAnalytics); // Added analytical route
router.get("/earnings", protectDeliveryPartner, getEarningsHistory);

// =======================================
// SYSTEM PROFILE & ORDERS OPERATIONS
// =======================================
router.get("/my-orders", protectDeliveryPartner, getMyOrders);
router.get("/profile", protectDeliveryPartner, getProfile);
router.put("/respond-order", protectDeliveryPartner, respondToOrder);
router.put("/update-status", protectDeliveryPartner, updateDeliveryStatus);
router.put("/update-profile", protectDeliveryPartner, upload.single("profileImage"), updateProfile);

// =======================================
// FINANCIAL ACTIONS
// =======================================
// Safe: Defined BEFORE the dynamic /:id parameter matching block
router.post("/withdraw-request", protectDeliveryPartner, createWithdrawRequest);

// =======================================
// DYNAMIC LOOKUP QUERY BY ID (Must Be Last)
// =======================================
router.get("/:id", getSingleDeliveryPartner);

export default router;