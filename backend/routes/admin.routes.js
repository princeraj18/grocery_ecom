import express from "express";

import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  refreshAdminToken,
  logoutAdmin,
  forgotAdminPassword,
  resetAdminPassword,
  getDeliveryDashboard,
  getDeliveryEarnings,
  getDeliveryPartnerDetails,
  getSystemSettings, updateSystemSettings

} from "../controllers/admin.controller.js";

import {
  getAllWithdrawRequests,
  getWithdrawRequestById,
  approveWithdrawRequest,
  rejectWithdrawRequest,
} from "../controllers/withdraw.controller.js";

import {
  getVendors,
  getSingleVendor,
  deleteVendor,
} from "../controllers/vendor.controller.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  registerAdmin
);

// LOGIN
router.post(
  "/login",
  loginAdmin
);

// REFRESH ACCESS TOKEN
router.post(
  "/refresh-token",
  refreshAdminToken
);

// LOGOUT
router.post(
  "/logout",
  logoutAdmin
);

// PROFILE
router.get(
  "/profile",
    adminAuth,
  getAdminProfile
);

// ADMIN: VENDOR MANAGEMENT
router.get("/vendors", adminAuth, getVendors);
router.get("/vendors/:id", adminAuth, getSingleVendor);
router.delete("/vendors/:id", adminAuth, deleteVendor);
router.post("/forgot-password", forgotAdminPassword);
router.post("/reset-password", resetAdminPassword);

// ADMIN: DELIVERY MANAGEMENT
router.get(
  "/delivery-dashboard",
  adminAuth,
  getDeliveryDashboard
);

router.get(
  "/delivery-earnings",
  adminAuth,
  getDeliveryEarnings
);

router.get(
  "/withdraw-requests",
  adminAuth,
  getAllWithdrawRequests
);

router.get(
  "/withdraw-requests/:id",
  adminAuth,
  getWithdrawRequestById
);

router.put(
  "/withdraw-requests/:id/approve",
  adminAuth,
  approveWithdrawRequest
);

router.put(
  "/withdraw-requests/:id/reject",
  adminAuth,
  rejectWithdrawRequest
);
router.get(
  "/delivery-partners/:id",
  adminAuth,
  getDeliveryPartnerDetails
);
// SYSTEM CONFIGURATIONS
router.get("/settings", adminAuth, getSystemSettings);
router.put("/settings", adminAuth, updateSystemSettings);
export default router;
