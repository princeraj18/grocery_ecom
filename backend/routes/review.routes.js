// routes/review.routes.js

import express from "express";

import {
  createReview,
  getAllReviews,
  deleteReview,
  getProductReviews,
  getVendorReviews,
} from "../controllers/review.controller.js";
import vendorAuth from "../middleware/vendorAuth.js";
import { protect } from "../middleware/auth.middlewar.js";

const router = express.Router();

router.post("/",protect, createReview);

router.get("/", getAllReviews);
router.get(
  "/vendor",
  vendorAuth,
  getVendorReviews
);
router.get(
  "/product/:productId",
  getProductReviews
);
router.delete("/:id", deleteReview);

export default router;