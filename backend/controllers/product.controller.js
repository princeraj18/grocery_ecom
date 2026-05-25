import Product from "../models/Product.model.js";

// ==============================
// CREATE PRODUCT
// ==============================
// import Product from "../models/Product.model.js";

// ==============================
// CREATE PRODUCT
// ==============================
export const createProduct = async (
  req,
  res
) => {

  try {

    console.log("BODY:", req.body);

    console.log("FILES:", req.files);

    // =========================
    // CHECK FILES
    // =========================
    if (
      !req.files ||
      req.files.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message: "No images uploaded",
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

    // =========================
    // CLOUDINARY URLS
    // =========================
    const imageUrls =
      req.files.map((file) => {

        console.log(
          "FILE PATH:",
          file.path
        );

        return file.path;
      });

    console.log(
      "IMAGE URLS:",
      imageUrls
    );

    // =========================
    // CREATE PRODUCT
    // =========================
    const product =
      await Product.create({

        name,

        description: [
          description,
        ],

        category,

        price,

        offerPrice,

        image: imageUrls,

        stockQuantity,

        inStock: true,

        bestseller: false,
      });

    return res.status(201).json({
      success: true,
      product,
    });

  } catch (error) {

    console.log(
      "FULL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// ==============================
// GET PRODUCTS
// ==============================
export const getProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find();

      res.status(200).json({
        success: true,
        products,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  export const deleteProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json({
        message:
          "Product deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const updateProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message: "Product not found",
        });
      }

      // UPDATE FIELDS
      product.name =
        req.body.name;

      product.category =
        req.body.category;

      product.price =
        req.body.price;

      product.offerPrice =
        req.body.offerPrice;

      product.stockQuantity =
        req.body.stockQuantity;

      product.inStock =
        req.body.inStock;

      product.description =
        JSON.parse(
          req.body.description
        );

      // NEW IMAGES
      if (
        req.files &&
        req.files.length > 0
      ) {

        product.image =
          req.files.map(
            (file) => file.path
          );
      }

      await product.save();

      res.status(200).json({
        message:
          "Product updated successfully",
        product,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

  // ==============================
// GET SINGLE PRODUCT
// ==============================
export const getSingleProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          success: false,
          message: "Product not found",
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