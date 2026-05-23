import Review from "../models/review.model.js";

// =========================
// CREATE REVIEW
// =========================
export const createReview =
  async (req, res) => {
    try {
      const {
        name,
        email,
        message,
      } = req.body;

      // Validation
      if (
        !name ||
        !email ||
        !message
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required",
        });
      }

      // Save Review
      const review =
        await Review.create({
          name,
          email,
          message,
        });

      res.status(201).json({
        success: true,
        message:
          "Message sent successfully",
        review,
      });
    } catch (error) {
      console.log(
        "CREATE REVIEW ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

// =========================
// GET ALL REVIEWS
// =========================
export const getAllReviews =
  async (req, res) => {
    try {
      const reviews =
        await Review.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.log(
        "GET REVIEWS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

// =========================
// DELETE REVIEW
// =========================
export const deleteReview =
  async (req, res) => {
    try {
      const review =
        await Review.findByIdAndDelete(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Review deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE REVIEW ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };