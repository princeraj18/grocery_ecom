import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";
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


  export const validateCoupon =
  async (req, res) => {
    try {
      const {
        code,
        cartItems,
      } = req.body;

      const coupon =
        await Coupon.findOne({
          code: code.toUpperCase(),
          isActive: true,
        });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Invalid coupon",
        });
      }

      if (
        new Date() >
        new Date(coupon.expiryDate)
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon expired",
        });
      }

      let vendorSubtotal = 0;

      for (const item of cartItems) {

        const product =
          await Product.findById(
            item.productId ||
            item._id
          );

        if (
          product &&
          product.vendor.toString() ===
          coupon.vendor.toString()
        ) {
          vendorSubtotal +=
            item.price *
            item.quantity;
        }
      }

      if (vendorSubtotal === 0) {
        return res.status(400).json({
          success: false,
          message:
            "This coupon is not applicable to products in your cart",
        });
      }

      if (
        vendorSubtotal <
        coupon.minOrderAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Minimum order amount ₹${coupon.minOrderAmount}`,
        });
      }

      let discount = 0;

      if (
        coupon.discountType ===
        "percentage"
      ) {
        discount =
          (vendorSubtotal *
            coupon.discountValue) /
          100;

        if (
          coupon.maxDiscount > 0
        ) {
          discount = Math.min(
            discount,
            coupon.maxDiscount
          );
        }
      } else {
        discount =
          coupon.discountValue;
      }

      res.status(200).json({
        success: true,
        discount,
        vendorSubtotal,
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
// GET PUBLIC ACTIVE COUPONS
// =======================================
export const getPublicCoupons =
  async (req, res) => {

    try {

      const now = new Date();

      const coupons =
        await Coupon.find({
          isActive: true,
          expiryDate: {
            $gte: now,
          },
        })
          .populate(
            "vendor",
            "shopName ownerName isVerified"
          )
          .sort({
            createdAt: -1,
          });

      const vendorIds =
        coupons.map((coupon) =>
          coupon.vendor?._id ||
          coupon.vendor
        );

      const products =
        await Product.find({
          vendor: {
            $in: vendorIds,
          },
        })
          .populate(
            "category",
            "text image bgColor"
          )
          .populate(
            "variants",
            "size price offerPrice stockQuantity"
          )
          .limit(60)
          .sort({
            createdAt: -1,
          });

      const productsByVendor =
        products.reduce(
          (grouped, product) => {
            const vendorId =
              product.vendor?.toString();

            grouped[vendorId] =
              grouped[vendorId] || [];

            grouped[vendorId].push(
              product
            );

            return grouped;
          },
          {}
        );

      res.status(200).json({
        success: true,
        coupons:
          coupons.map((coupon) => {
            const couponObj =
              coupon.toObject();

            const vendorId =
              couponObj.vendor?._id?.toString() ||
              couponObj.vendor?.toString();

            return {
              ...couponObj,
              products:
                productsByVendor[
                  vendorId
                ] || [],
            };
          }),
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
