import express from "express";

import {
  getAnalytics,
  
} from "../controllers/analytics.controller.js";

import adminAuth from "../middleware/adminAuth.js";
// import vendorAuth from "../middleware/vendorAuth.js";
const router =
  express.Router();

// ==============================
// GET ANALYTICS
// ==============================
router.get(
  "/",
  adminAuth,
  getAnalytics
);


// router.get(
//   "/vendor",
//   vendorAuth,
//   getVendorAnalytics
// );

export default router;