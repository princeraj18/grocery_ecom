import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

// ==========================================
// CREATE PRODUCT
// ==========================================
export const createProduct = async (
  req,
  res
) => {
  try {

    const {
      name,
      description,
      category,
      price,
      offerPrice,
      inStock,
      stockQuantity,
      bestseller,
      images,
    } = req.body;

    // ============================
    // UPLOAD IMAGES TO CLOUDINARY
    // ============================

    let imageUrls = [];

    for (const image of images) {

      const uploaded =
        await cloudinary.uploader.upload(
          image,
          {
            folder: "grocery_products",
          }
        );

      imageUrls.push(
        uploaded.secure_url
      );
    }

    // ============================
    // CREATE PRODUCT
    // ============================

    const product =
      await Product.create({
        name,
        description,
        category,
        price,
        offerPrice,
        image: imageUrls,
        inStock,
        stockQuantity,
        bestseller,
      });

    res.status(201).json({
      success: true,
      product,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Product creation failed",
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
      await Product.find();

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch products",
    });
  }
};