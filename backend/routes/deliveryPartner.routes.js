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
  
} from "../controllers/deliveryPartner.controller.js";

import {
  protectDeliveryPartner,
} from "../middleware/deliveryPartner.middleware.js";

import vendorAuth from "../middleware/vendorAuth.js";

import upload from "../middleware/upload.js";
import { createWithdrawRequest } from "../controllers/withdraw.controller.js";

const router = express.Router();

// =======================================
// AUTH ROUTES
// =======================================

router.post(
  "/register",
  registerDeliveryPartner
);

router.post(
  "/login",
  loginDeliveryPartner
);

// =======================================
// VENDOR ROUTES
// =======================================

router.get(
  "/all",
  vendorAuth,
  getDeliveryPartners
);

// =======================================
// DELIVERY PARTNER ROUTES
// =======================================

router.get(
  "/my-orders",
  protectDeliveryPartner,
  getMyOrders
);

router.get(
  "/dashboard",
  protectDeliveryPartner,
  getDashboardData
);

router.put(
  "/respond-order",
  protectDeliveryPartner,
  respondToOrder
);

router.put(
  "/update-status",
  protectDeliveryPartner,
  updateDeliveryStatus
);

router.get(
  "/earnings",
  protectDeliveryPartner,
  getEarningsHistory
);

router.put(
  "/update-profile",
  protectDeliveryPartner,
  upload.single("profileImage"),
  updateProfile
);

router.get(
  "/profile",
  protectDeliveryPartner,
  getProfile
);

// =======================================
// WITHDRAW REQUEST
// =======================================

router.post(
  "/withdraw-request",
  protectDeliveryPartner,
  createWithdrawRequest
);

export default router;