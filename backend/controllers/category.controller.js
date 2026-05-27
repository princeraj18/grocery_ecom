import Category from "../models/Category.model.js";

// ========================
// CREATE CATEGORY
// ========================
import { cloudinary, isCloudAvailable } from "../config/cloudinary.js";
import fs from "fs";
import pathModule from "path";


export const createCategory = async (req, res) => {
  try {
    const { text, path, bgColor } = req.body;
    console.log("REQ FILE:", req.file);

    // Basic validation for required fields
    const missing = [];
    if (!text || (typeof text === "string" && text.trim() === "")) missing.push("text");
    if (!path || (typeof path === "string" && path.trim() === "")) missing.push("path");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    if (missing.length > 0) {
      // Clean up the uploaded file if present to avoid orphan files
      try {
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore cleanup errors
      }

      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // Read file buffer from the local upload (multer diskStorage)
    const fileBuffer = fs.readFileSync(req.file.path);

    // Helper: upload buffer to Cloudinary via upload_stream
    const uploadToCloudinary = (buffer, filename) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "categories", public_id: `${Date.now()}-${filename}` },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(buffer);
      });

    // Timeout wrapper to avoid long-hanging uploads
    const uploadWithTimeout = (buffer, filename, ms = 30000) =>
      Promise.race([
        uploadToCloudinary(buffer, filename),
        new Promise((_, reject) =>
          setTimeout(() => {
            const err = new Error("Cloudinary upload timeout");
            err.name = "TimeoutError";
            err.http_code = 499;
            reject(err);
          }, ms)
        ),
      ]);

    // If Cloudinary is not available (failed ping or bad creds), try unsigned upload if preset exists
    if (!isCloudAvailable()) {
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
      if (uploadPreset) {
        try {
          // attempt unsigned upload via direct HTTP POST
          const cloudName = process.env.CLOUD_NAME;
          const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
          const form = new FormData();
          form.append('file', fileBuffer, req.file.originalname || req.file.filename || `category-${Date.now()}`);
          form.append('upload_preset', uploadPreset);

          const resp = await fetch(url, { method: 'POST', body: form });
          const json = await resp.json();
          if (!resp.ok) throw new Error(JSON.stringify(json));

          // Remove local file
          try { fs.unlinkSync(req.file.path); } catch (e) {}

          const category = await Category.create({
            text,
            path,
            bgColor,
            image: json.secure_url || json.url,
          });

          return res.status(201).json({
            success: true,
            message: 'Category Created (unsigned upload)',
            category,
          });
        } catch (e) {
          console.warn('Unsigned Cloudinary upload failed, falling back to local:', e.message || e);
        }
      }

      console.log("Cloudinary not available — using local upload fallback");
      const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const safeName = pathModule.basename(req.file.path);
      const localUrl = `${base}/uploads/${safeName}`;

      const category = await Category.create({
        text,
        path,
        bgColor,
        image: localUrl,
      });

      return res.status(201).json({
        success: true,
        message: "Category Created (local fallback - cloud not available)",
        category,
      });
    }

    let result;
    try {
      result = await uploadWithTimeout(
        fileBuffer,
        req.file.originalname || req.file.filename || `category-${Date.now()}`
      );

      // Remove the local file after successful Cloudinary upload to save space
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore cleanup failure
      }
    } catch (err) {
      console.log("CLOUDINARY UPLOAD ERROR (fallback to local):", err);

      // Fallback: serve the already-saved local upload
      const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const safeName = pathModule.basename(req.file.path);
      const localUrl = `${base}/uploads/${safeName}`;

      const category = await Category.create({
        text,
        path,
        bgColor,
        image: localUrl,
      });

      return res.status(201).json({
        success: true,
        message: "Category Created (local fallback)",
        category,
      });
    }

    const category = await Category.create({
      text,
      path,
      bgColor,
      image: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Category Created Successfully",
      category,
    });
  } catch (error) {
    console.log("CREATE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================
// GET ALL CATEGORIES
// ========================
export const getCategories =
  async (req, res) => {
    try {
      const categories =
        await Category.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.log(
        "GET CATEGORIES ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ========================
// GET SINGLE CATEGORY
// ========================
export const getCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.log(
        "GET CATEGORY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ========================
// UPDATE CATEGORY
// ========================
export const updateCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.log(
        "UPDATE CATEGORY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ========================
// DELETE CATEGORY
// ========================
export const deleteCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findByIdAndDelete(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE CATEGORY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };