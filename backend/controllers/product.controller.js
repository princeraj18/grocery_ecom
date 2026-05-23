import Product from "../models/product.model.js";

// ======================================
// GET SINGLE PRODUCT
// ======================================
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
        message:
          "Failed to fetch product",
      });
    }
  };

// ======================================
// GET RELATED PRODUCTS
// ======================================
export const getRelatedProducts =
  async (req, res) => {
    try {
      const {
        category,
        productId,
      } = req.params;

      const products =
        await Product.find({
          category,
          _id: {
            $ne: productId,
          },
        }).limit(4);

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch related products",
      });
    }
  };