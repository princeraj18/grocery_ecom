import Wishlist from "../models/wishlist.model.js";

// ======================================
// ADD TO WISHLIST
// ======================================
export const addToWishlist =
  async (req, res) => {

    try {

      const {
        userId,
        productId,
      } = req.body;

      // VALIDATION
      if (
        !userId ||
        !productId
      ) {

        return res.status(400).json({
          success: false,
          message:
            "User ID and Product ID required",
        });
      }

      // CHECK EXISTING
      const existing =
        await Wishlist.findOne({
          user: userId,
          product: productId,
        });

      if (existing) {

        return res.status(400).json({
          success: false,
          message:
            "Already in wishlist",
        });
      }

      // CREATE
      const wishlist =
        await Wishlist.create({
          user: userId,
          product: productId,
        });

      res.status(201).json({
        success: true,
        message:
          "Added to wishlist",
        wishlist,
      });

    } catch (error) {

      console.log(
        "ADD WISHLIST ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// GET USER WISHLIST
// ======================================
// import Wishlist from "../models/wishlist.model.js";

// =========================
// GET WISHLIST
// =========================
export const getWishlist =
  async (req, res) => {

    try {

      const wishlist =
        await Wishlist.find({
          user: req.params.userId,
        }).populate("product");

      res.status(200).json({
        success: true,
        wishlist,
      });

    } catch (error) {

      console.log(
        "GET WISHLIST ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// REMOVE WISHLIST
// ======================================
export const removeWishlist =
  async (req, res) => {

    try {

      const {
        userId,
        productId,
      } = req.body;

      await Wishlist.findOneAndDelete({
        user: userId,
        product: productId,
      });

      res.status(200).json({
        success: true,
        message:
          "Removed from wishlist",
      });

    } catch (error) {

      console.log(
        "REMOVE WISHLIST ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };