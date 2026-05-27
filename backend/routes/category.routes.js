import express from "express";
import { cloudinary } from "../config/cloudinary.js";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();


router.get("/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log("CLOUDINARY TEST ERROR:", error);

    res.status(500).json({
      success: false,
      error,
    });
  }
});
// Create
router.post(
  "/create",
  
   upload.single("image"),
  createCategory
);

// Get all
router.get(
  "/",
  getCategories
);

// Get one
router.get(
  "/:id",
  getCategory
);

// Update
router.put(
  "/:id",
  updateCategory
);

// Delete
router.delete(
  "/:id",
  deleteCategory
);

export default router;