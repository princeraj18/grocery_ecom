import express from "express";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  getSingleProduct
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// CREATE PRODUCT
router.post(
  "/",
  upload.array("images", 5),
  createProduct
);

// GET PRODUCTS
router.get(
  "/",
  getProducts
);
router.delete("/:id", deleteProduct);
router.put(
  "/:id",
  upload.array("image", 5),
  updateProduct
);
// GET SINGLE PRODUCT
router.get(
  "/:id",
  getSingleProduct
);
export default router;