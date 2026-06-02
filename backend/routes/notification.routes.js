import express from "express";

import { protect } from "../middleware/auth.middlewar.js";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// =====================================
// GET USER NOTIFICATIONS
// =====================================

router.get(
  "/my-notifications",
  protect,
  getMyNotifications
);

// =====================================
// MARK AS READ
// =====================================

router.put(
  "/read/:id",
  protect,
  markNotificationAsRead
);

export default router;