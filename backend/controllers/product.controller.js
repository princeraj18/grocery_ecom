import Product from "../models/Product.model.js";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

// ==========================================
// CREATE PRODUCT
// ==========================================
export const createProduct = async (
  req,
  res
) => {
  try {

    // CHECK LOGIN
    if (!req.vendor) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // CHECK IMAGES
    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please upload images",
      });
    }

    const {
      name,
      description,
      category,
      price,
      offerPrice,
      stockQuantity,
    } = req.body;

    // IMAGE URLS - upload buffers to Cloudinary with a local fallback
    const uploadToCloudinary = (buffer, filename) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "products", public_id: `${Date.now()}-${filename}` },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(buffer);
      });

    const uploadWithTimeout = (buffer, filename, ms = 30000) =>
      Promise.race([
        uploadToCloudinary(buffer, filename),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Cloudinary upload timeout")), ms)
        ),
      ]);

    const imageUrls = [];

    for (const file of req.files) {
      try {
        const result = await uploadWithTimeout(
          file.buffer,
          file.originalname || file.filename
        );

        imageUrls.push(result.secure_url || result.url || "");
      } catch (err) {
        // Fallback: save to local uploads/ and serve from /uploads
        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const safeName = `${Date.now()}-${(file.originalname || file.filename || "file").replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, file.buffer);

        const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const url = `${base}/uploads/${safeName}`;

        imageUrls.push(url);

        console.warn("Cloudinary upload failed, saved locally:", filePath, "error:", err.message || err);
      }
    }

    // CREATE PRODUCT
    const product =
      await Product.create({
        vendor: req.vendor._id,

        name,

        description: [description],

        category,

        price,

        offerPrice,

        image: imageUrls,

        stockQuantity,

        inStock: true,

        bestseller: false,
      });

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });

  } catch (error) {

    console.log(
      "CREATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================
export const getProducts = async (
  req,
  res
) => {
  try {

    const products =
      await Product.find()
        .populate(
          "vendor",
          "shopName ownerName"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET VENDOR PRODUCTS
// ==========================================
export const getVendorProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find({
          vendor: req.vendor._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        products,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
export const getSingleProduct =
  async (req, res) => {

    try {

      // Validate product id to avoid CastError
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
      }

      const product = await Product.findById(
        req.params.id
      ).populate("vendor", "shopName ownerName");

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ==========================================
// UPDATE PRODUCT
// ==========================================
export const updateProduct =
  async (req, res) => {

    try {

      // Validate product id to avoid CastError
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
      }

      const product = await Product.findById(
        req.params.id
      );

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      // CHECK OWNER
      if (
        product.vendor.toString() !==
        req.vendor._id.toString()
      ) {

        return res.status(403).json({
          success: false,
          message:
            "You can update only your products",
        });
      }

      // UPDATE FIELDS
      product.name =
        req.body.name ||
        product.name;

      product.category =
        req.body.category ||
        product.category;

      product.price =
        req.body.price ||
        product.price;

      product.offerPrice =
        req.body.offerPrice ||
        product.offerPrice;

      product.stockQuantity =
        req.body.stockQuantity ||
        product.stockQuantity;

      product.inStock =
        req.body.inStock ??
        product.inStock;

      // DESCRIPTION
      if (req.body.description) {

        product.description = [
          req.body.description,
        ];
      }

      // UPDATE IMAGES
      if (req.files && req.files.length > 0) {
        // reuse upload logic: upload buffers to Cloudinary with fallback
        const newImageUrls = [];

        for (const file of req.files) {
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "products", public_id: `${Date.now()}-${file.originalname}` },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result);
                }
              );

              stream.end(file.buffer);
            });

            newImageUrls.push(uploadResult.secure_url || uploadResult.url || "");
          } catch (err) {
            // fallback local
            const uploadsDir = path.join(process.cwd(), "uploads");
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

            const safeName = `${Date.now()}-${(file.originalname || file.filename || "file").replace(/\s+/g, "-")}`;
            const filePath = path.join(uploadsDir, safeName);
            fs.writeFileSync(filePath, file.buffer);

            const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
            newImageUrls.push(`${base}/uploads/${safeName}`);
          }
        }

        product.image = newImageUrls;
      }

      await product.save();

      res.status(200).json({
        success: true,
        message:
          "Product updated successfully",
        product,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ==========================================
// DELETE PRODUCT
// ==========================================
export const deleteProduct =
  async (req, res) => {

    try {

      // Validate product id to avoid CastError
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
      }

      const product = await Product.findById(
        req.params.id
      );

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      // CHECK OWNER
      if (
        product.vendor.toString() !==
        req.vendor._id.toString()
      ) {

        return res.status(403).json({
          success: false,
          message:
            "You can delete only your products",
        });
      }

      await product.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Product deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };