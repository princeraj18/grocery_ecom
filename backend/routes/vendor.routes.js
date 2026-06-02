import express from "express";

import upload from "../middleware/upload.js";

import {
  registerVendor,
  loginVendor,
  getVendors,
  getSingleVendor,
  updateVendor,
  deleteVendor,
  getVendorProfile,
  verifyVendor,
  unverifyVendor,
  forgotVendorPassword,
  resetVendorPassword
} from "../controllers/vendor.controller.js";

import vendorAuth from "../middleware/vendorAuth.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  registerVendor
);

// LOGIN
router.post(
  "/login",
  loginVendor
);

// PROFILE
router.get(
  "/profile",
  vendorAuth,
  getVendorProfile
);

// GET ALL VENDORS
router.get(
  "/",
  vendorAuth,
  getVendors
);

// GET SINGLE VENDOR
router.get(
  "/:id",
  vendorAuth,
  getSingleVendor
);

// UPDATE VENDOR
router.put(
  "/:id",
  upload.single("logo"),
  vendorAuth,
  updateVendor
);

// DELETE VENDOR
router.delete(
  "/:id",
  vendorAuth,
  deleteVendor
);
// VERIFY VENDOR
router.put(
  "/verify/:id",
  verifyVendor
);

// UNVERIFY VENDOR
router.put(
  "/unverify/:id",
  unverifyVendor
);
router.post("/forgot-password", forgotVendorPassword); // NEW
router.post("/reset-password", resetVendorPassword);   // NEW
export default router;