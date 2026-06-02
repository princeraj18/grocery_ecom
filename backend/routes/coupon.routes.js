import express from "express";

import vendorAuth from "../middleware/vendorAuth.js";

import {
  createCoupon,
  getPublicCoupons,
  getVendorCoupons,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon,

} from "../controllers/coupon.controller.js";

const router = express.Router();

// =======================================
// GET PUBLIC COUPONS
// =======================================
router.get(
  "/public",
  getPublicCoupons
);

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
router.post(
  "/validate",
  validateCoupon
);
export default router;
