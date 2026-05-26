import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// ADD
router.post(
  "/add",
  addToWishlist
);

// GET
router.get(
  "/:userId",
  getWishlist
);

// REMOVE
router.delete(
  "/remove",
  removeWishlist
);

export default router;