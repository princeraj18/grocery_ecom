import express from "express";

import vendorAuth from "../middleware/vendorAuth.js";

import {
  getDashboardStats,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/stats",
  vendorAuth,
  getDashboardStats
);

export default router;