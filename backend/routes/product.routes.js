import express from "express";

import {
  createProduct,
  getProducts,
  getVendorProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.js";

import vendorAuth from "../middleware/vendorAuth.js";

const router = express.Router();

// ==========================================
// CREATE PRODUCT
// ==========================================
// Wrap multer upload so we can catch upload/storage errors and return clear responses
const handleUpload = (req, res, next) => {
  const middleware = upload.array("images", 5);
  middleware(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR:", err);

      // Cloudinary timeouts and storage-specific errors
      if (err && (err.name === "TimeoutError" || err.http_code === 499)) {
        return res.status(504).json({
          success: false,
          message:
            "Cloudinary upload timed out. Check CLOUDINARY credentials and network connectivity.",
          details: err,
        });
      }

      // return other upload errors
      return res.status(500).json({
        success: false,
        message: err.message || "Upload error",
        details: err,
      });
    }
    next();
  });
};

router.post(
  "/",
  vendorAuth,
  handleUpload,
  createProduct
);

// ==========================================
// GET ALL PRODUCTS
// ==========================================
router.get(
  "/",
  getProducts
);

// ==========================================
// GET VENDOR PRODUCTS
// ==========================================
router.get(
  "/vendor/my-products",
  vendorAuth,
  getVendorProducts
);

// Alias for vendor products for compatibility with frontend
router.get(
  "/vendor",
  vendorAuth,
  getVendorProducts
);

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
router.get(
  "/:id",
  getSingleProduct
);

// ==========================================
// UPDATE PRODUCT
// ==========================================
router.put(
  "/:id",
  vendorAuth,
  upload.array("images", 5),
  updateProduct
);

// ==========================================
// DELETE PRODUCT
// ==========================================
router.delete(
  "/:id",
  vendorAuth,
  deleteProduct
);

export default router;