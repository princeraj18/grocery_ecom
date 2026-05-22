import express from "express";

import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCart);

router.post("/add", addToCart);

router.put("/update", updateCart);

router.delete("/remove", removeFromCart);

router.delete(
  "/clear/:userId",
  clearCart
);

export default router;