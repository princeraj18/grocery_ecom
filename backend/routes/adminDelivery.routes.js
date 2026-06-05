import express from "express";

import adminAuth from "../middleware/adminAuth.js";

import {
  getDeliveryDashboard,
  
} from "../controllers/adminDelivery.controller.js";

const router = express.Router();

// =====================================
// DELIVERY PARTNER DASHBOARD
// =====================================

router.get(
  "/dashboard",
  adminAuth,
  getDeliveryDashboard
);

export default router;