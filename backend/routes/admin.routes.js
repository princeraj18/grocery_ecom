import express from "express";

import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from "../controllers/admin.controller.js";

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

export default router;