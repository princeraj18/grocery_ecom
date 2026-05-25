import Coupon from "../models/coupon.model.js";

// =======================================
// CREATE COUPON
// =======================================
export const createCoupon =
  async (req, res) => {

    try {

      const {
        code,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        expiryDate,
      } = req.body;

      // CHECK EXISTING
      const existingCoupon =
        await Coupon.findOne({
          code:
            code.toUpperCase(),
        });

      if (existingCoupon) {

        return res.status(400).json({
          success: false,
          message:
            "Coupon already exists",
        });
      }

      const coupon =
        await Coupon.create({
          vendor:
            req.vendor._id,

          code,

          discountType,

          discountValue,

          minOrderAmount,

          maxDiscount,

          expiryDate,
        });

      res.status(201).json({
        success: true,
        message:
          "Coupon created successfully",
        coupon,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// =======================================
// GET VENDOR COUPONS
// =======================================
export const getVendorCoupons =
  async (req, res) => {

    try {

      const coupons =
        await Coupon.find({
          vendor:
            req.vendor._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        coupons,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// =======================================
// DELETE COUPON
// =======================================
export const deleteCoupon =
  async (req, res) => {

    try {

      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {

        return res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });
      }

      // CHECK OWNER
      if (
        coupon.vendor.toString() !==
        req.vendor._id.toString()
      ) {

        return res.status(403).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      await coupon.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Coupon deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// =======================================
// TOGGLE COUPON STATUS
// =======================================
export const toggleCouponStatus =
  async (req, res) => {

    try {

      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {

        return res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });
      }

      coupon.isActive =
        !coupon.isActive;

      await coupon.save();

      res.status(200).json({
        success: true,
        message:
          "Coupon updated successfully",
        coupon,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };