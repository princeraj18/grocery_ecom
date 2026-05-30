import Review from "../models/review.model.js";
// import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
export const createReview = async (req, res) => {
  try {
    console.log("REVIEW BODY:", req.body);

    const { user, product, rating, comment } = req.body;

    const review = await Review.create({
      user:req.user,
      product,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });

  } catch (error) {
    console.log("CREATE REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
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



  export const getProductReviews = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVendorReviews = async (
  req,
  res
) => {
  try {
    const vendorId = req.vendor._id;

    // Get all products owned by vendor
    const products = await Product.find({
      vendor: vendorId,
    }).select("_id");

    const productIds = products.map(
      (product) => product._id
    );

    // Get reviews for those products only
    const reviews = await Review.find({
      product: {
        $in: productIds,
      },
    })
      .populate(
        "user",
        "name email"
      )
      .populate(
        "product",
        "name image category"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(
      "GET VENDOR REVIEWS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};