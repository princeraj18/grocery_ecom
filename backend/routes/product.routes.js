import express from "express";

import {
  createProduct,
  getProducts,
  getVendorProducts,
  getSingleProduct,
  updateProduct,
  updateInventoryStock,
  deleteProduct,
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.js";
import vendorAuth from "../middleware/vendorAuth.js";

const router = express.Router();

// ==========================================
// MULTER ERROR HANDLER
// ==========================================
const handleUpload = (req, res, next) => {
  const middleware = upload.array(
    "images",
    5
  );

  middleware(
    req,
    res,
    (err) => {
      if (err) {
        console.error(
          "UPLOAD ERROR:",
          err
        );

        if (
          err.name ===
            "TimeoutError" ||
          err.http_code === 499
        ) {
          return res
            .status(504)
            .json({
              success: false,
              message:
                "Cloudinary upload timed out. Check configuration.",
            });
        }

        return res
          .status(500)
          .json({
            success: false,
            message:
              err.message ||
              "Upload Error",
          });
      }

      next();
    }
  );
};

// ==========================================
// CREATE PRODUCT
// ==========================================
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

// Main Route
router.get(
  "/vendor/my-products",
  vendorAuth,
  getVendorProducts
);

// Alias Route
router.get(
  "/vendor",
  vendorAuth,
  getVendorProducts
);

// Inventory Route
router.get(
  "/vendor-products",
  vendorAuth,
  getVendorProducts
);

router.patch(
  "/:id/inventory",
  vendorAuth,
  updateInventoryStock
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
  upload.array(
    "images",
    5
  ),
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
