import express from "express";

import vendorAuth from "../middleware/vendorAuth.js";

import {
  getVendorAnalytics,
} from "../controllers/vendorAnalytics.controller.js";

const router = express.Router();

router.get(
  "/analytics",
  vendorAuth,
  getVendorAnalytics
);

export default router;