import express from "express";

import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  forgotAdminPassword,
  resetAdminPassword,
} from "../controllers/admin.controller.js";

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

// PROFILE
router.get(
  "/profile",
  getAdminProfile
);

// ADMIN: VENDOR MANAGEMENT
router.get("/vendors", adminAuth, getVendors);
router.get("/vendors/:id", adminAuth, getSingleVendor);
router.delete("/vendors/:id", adminAuth, deleteVendor);
router.post("/forgot-password", forgotAdminPassword);
router.post("/reset-password", resetAdminPassword);

export default router;