import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  getSingleUser,
  forgotPassword, // New controller
  resetPassword,  // New controller
  
  deleteUser

} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middlewar.js ";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.get(
  "/",
  getAllUsers
);

// GET SINGLE USER
router.get(
  "/:id",
  getSingleUser
);
router.delete(
  "/:id",
  deleteUser
);

router.post("/forgot-password", forgotPassword); // NEW
router.post("/reset-password", resetPassword);   // NEW
export default router;