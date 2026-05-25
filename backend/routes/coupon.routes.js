import express from "express";

import vendorAuth from "../middleware/vendorAuth.js";

import {
  createCoupon,
  getVendorCoupons,
  deleteCoupon,
  toggleCouponStatus,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// =======================================
// CREATE COUPON
// =======================================
router.post(
  "/",
  vendorAuth,
  createCoupon
);

// =======================================
// GET VENDOR COUPONS
// =======================================
router.get(
  "/",
  vendorAuth,
  getVendorCoupons
);

// =======================================
// DELETE COUPON
// =======================================
router.delete(
  "/:id",
  vendorAuth,
  deleteCoupon
);

// =======================================
// TOGGLE STATUS
// =======================================
router.put(
  "/toggle/:id",
  vendorAuth,
  toggleCouponStatus
);

export default router;