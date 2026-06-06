import express from "express";

import adminAuth from "../middleware/adminAuth.js";

import {
  getDeliveryPartnersDashboard,
  getDeliveryPartner,
} from "../controllers/adminDelivery.controller.js";

const router = express.Router();

// =====================================
// DELIVERY PARTNER DASHBOARD
// =====================================

router.get(
  "/dashboard",
  adminAuth,
  getDeliveryPartnersDashboard
);

router.get("/:id", adminAuth, getDeliveryPartner);

export default router;