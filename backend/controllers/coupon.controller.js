import Coupon from "../models/Coupon.model.js";

// CREATE
export const createCoupon =
  async (req, res) => {

    try {

      const coupon =
        await Coupon.create(
          req.body
        );

      res.status(201).json({
        success: true,
        coupon,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
      });
    }
  };

// GET
export const getCoupons =
  async (req, res) => {

    try {

      const coupons =
        await Coupon.find();

      res.status(200).json({
        success: true,
        coupons,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
      });
    }
  };

// DELETE
export const deleteCoupon =
  async (req, res) => {

    try {

      await Coupon.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
      });
    }
  };