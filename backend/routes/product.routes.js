import express from "express";

import {
  getSingleProduct,
  getRelatedProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

// Single Product
router.get(
  "/:id",
  getSingleProduct
);

// Related Products
router.get(
  "/related/:category/:productId",
  getRelatedProducts
);

export default router;