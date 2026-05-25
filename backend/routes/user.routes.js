import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  getSingleUser,
  
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
export default router;